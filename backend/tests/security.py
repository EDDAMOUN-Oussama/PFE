import json, os, subprocess, time, urllib.request, urllib.error, http.cookiejar, socket, tempfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
PHP=os.environ.get('PHP_BIN', 'php')
for port in [8099, 8199]:
    with socket.socket() as probe:
        if probe.connect_ex(('127.0.0.1', port)) == 0:
            raise RuntimeError(f'Test port {port} is already in use; stop that test server first.')
env=dict(os.environ, DB_NAME='healthytrack_test_' + str(time.time_ns()), DB_HOST='127.0.0.1', DB_USER='root', DB_PASSWORD='', DB_PORT='3306', DB_SSL_CA='', APP_ENV='development', APP_TIMEZONE='Africa/Casablanca', FRONTEND_URL='http://localhost:8080', MAIL_TRANSPORT='smtp', MAIL_USERNAME='', MAIL_PASSWORD='', MAIL_FROM_ADDRESS='', BREVO_API_KEY='', SMTP_USER='', SMTP_PASSWORD='', SMTP_FROM='')
subprocess.run([PHP,str(root/'tests/prepare.php')],env=env,check=True)
server=subprocess.Popen([PHP,'-S','127.0.0.1:8099','-t',str(root/'public'),str(root/'public/index.php')],env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
checks=0
try:
    time.sleep(1)
    if server.poll() is not None: raise RuntimeError('Test PHP server did not start')
    def client(): return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
    def request(c,path,data=None,token=None):
        headers={'Content-Type':'application/json'}
        if token: headers['X-CSRF-Token']=token
        r=urllib.request.Request('http://127.0.0.1:8099/'+path,data=None if data is None else json.dumps(data).encode(),headers=headers)
        try:
            with c.open(r) as response: return response.status,json.load(response)
        except urllib.error.HTTPError as e: return e.code,json.load(e)
    def expect(code,expected):
        global checks
        assert code==expected,(code,expected)
        checks+=1
    c=client()
    expect(request(c,'getUser.php?id=1')[0],401)
    _,session=request(c,'session.php'); token=session['csrfToken']
    expect(request(c,'login.php',{'email':'test0@example.test','password':'TestPassword123!'})[0],403)
    expect(request(c,'login.php',{'email':'test0@example.test','password':'TestPassword123!'},token)[0],200)
    expect(request(c,'getUser.php?id=1')[0],200)
    expect(request(c,'getUser.php?id=2')[0],403)
    expect(request(c,'updateUser.php',{'id':2},token)[0],403)
    expect(request(c,'getSpecialistRequests.php')[0],403)
    expect(request(c,'updateSpecialistRequest.php',{'request_id':1,'new_status':'approved'},token)[0],403)
    expect(request(c,'deleteGoal.php',{'goalId':999},token)[0],404)
    expect(request(c,'updateAppointmentStatus.php',{'appointment_id':1,'new_status':'confirmed'},token)[0],403)
    expect(request(c,'logout.php',{},token)[0],200)
    expect(request(c,'getUser.php?id=1')[0],401)
    admin=client(); _,session=request(admin,'session.php'); token=session['csrfToken']
    expect(request(admin,'login.php',{'email':'test2@example.test','password':'TestPassword123!'},token)[0],200)
    expect(request(admin,'getSpecialistRequests.php')[0],200)
    expect(request(admin,'updateSpecialistRequest.php',{'request_id':1,'new_status':'invalid'},token)[0],400)
    # Exercise actual endpoints only against the isolated synthetic database.
    staff,staff_token=admin,token
    admin=client(); _,session=request(admin,'session.php'); token=session['csrfToken']
    expect(request(admin,'login.php',{'email':'test0@example.test','password':'TestPassword123!'},token)[0],200)
    def sql(script):
        prefix="<?php require " + json.dumps(str(root/'helpers/database.php').replace(chr(92),'/')) + "; "
        r=subprocess.run([PHP],input=prefix+script,text=True,capture_output=True,env=env)
        if r.returncode: raise RuntimeError(r.stdout+r.stderr)
        return r.stdout.strip()
    today=time.strftime('%Y-%m-%d')
    payload={'userId':1,'type':'weight','title':'Lose weight','currentValue':80.5,'target':70,'deadline':today}
    code,result=request(admin,'addGoal.php',payload,token); expect(code,201); goal=result['goal']['id']
    code,_=request(admin,'addWeightEntry.php',{'userId':1,'weight':75.25,'date':today},token); expect(code,201)
    code,goals=request(admin,'getGoals.php?user_id=1'); expect(code,200)
    assert float(goals['goals'][0]['currentValue'])==75.25
    assert 0<float(goals['goals'][0]['progress'])<100
    checks+=2
    code,_=request(admin,'addFoodEntry.php',{'userId':1,'name':'Test meal','maleType':'lunch','calories':500,'protein':20.5,'date':today},token); expect(code,201)
    code,_=request(admin,'addExerciseEntry.php',{'userId':1,'name':'Test walk','type':'cardio','duration':30,'caloriesBurned':100,'date':today},token); expect(code,201)
    code,result=request(admin,'getExerciseEntries.php?user_id=1'); expect(code,200); assert len(result['entries'])==1; checks+=1
    for _ in range(2): expect(request(admin,'updateDailyStats.php',{'userId':1,'date':today,'caloriesConsumed':9999},token)[0],200)
    code,stats=request(admin,'getDailyStats.php?user_id=1'); expect(code,200)
    assert int(stats['data']['caloriesConsumed'])==500 and int(stats['data']['caloriesBurned'])==100
    assert float(stats['data']['currentWeight'])==75.25; checks+=2
    expect(request(admin,'addFoodEntry.php',{'userId':1,'name':'Second meal','maleType':'dinner','calories':300,'date':today},token)[0],201)
    code,report=request(admin,'getCalorieStats.php?user_id=1'); expect(code,200)
    assert report['data'][-1]['calories']==800; checks+=1
    code,report=request(admin,'getMonthlySummary.php?user_id=1'); expect(code,200)
    assert report['data']['avgCalories']==800; checks+=1
    # Force a later write to fail and prove the earlier entry insert rolls back.
    before=sql("echo rows('SELECT COUNT(*) AS n FROM foodEntry')[0]['n'];")
    sql("Database::connect()->query(\"CREATE TRIGGER reject_test_stats BEFORE INSERT ON DailyStats FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='test rollback'\");")
    expect(request(admin,'addFoodEntry.php',{'userId':1,'name':'Must rollback','maleType':'lunch','calories':50,'date':today},token)[0],500)
    sql('Database::connect()->query("DROP TRIGGER reject_test_stats");')
    assert before==sql("echo rows('SELECT COUNT(*) AS n FROM foodEntry')[0]['n'];"); checks+=1
    # Reset codes are purpose-bound, expire, have an attempt budget, and cannot be reused.
    sql("query(\"INSERT INTO auth_codes (user_id,purpose,email,code_hash,expires_at,attempts) VALUES (1,'reset','test0@example.test',?,DATE_ADD(NOW(),INTERVAL 10 MINUTE),0)\",[password_hash('123456',PASSWORD_DEFAULT)]);")
    reset={'email':'test0@example.test','code_viryfication':'123456','password':'NewPassword123!'}
    expect(request(admin,'resetpass.php',reset,token)[0],200)
    expect(request(admin,'resetpass.php',reset,token)[0],400)
    # Missing SMTP configuration must produce one JSON response, with no partial profile write.
    expect(request(staff,'updateUser.php',{'id':3,'name':'Changed','birthdate':'1995-01-01','email':'new@example.test'},staff_token)[0],503)
    assert sql("echo rows('SELECT name FROM users WHERE id=3')[0]['name'];")=='Test 2'; checks+=1
    # Expiration and failed-attempt limits are enforced independently of session state.
    sql("query(\"INSERT INTO auth_codes (user_id,purpose,email,code_hash,expires_at,attempts) VALUES (1,'reset','test0@example.test',?,DATE_SUB(NOW(),INTERVAL 1 MINUTE),0)\",[password_hash('654321',PASSWORD_DEFAULT)]);")
    reset['code_viryfication']='654321'
    expect(request(admin,'resetpass.php',reset,token)[0],400)
    sql("query(\"UPDATE auth_codes SET expires_at=DATE_ADD(NOW(),INTERVAL 10 MINUTE), attempts=0 WHERE user_id=1 AND purpose='reset'\");")
    for _ in range(5):
        reset['code_viryfication']='000000'; expect(request(admin,'resetpass.php',reset,token)[0],400)
    reset['code_viryfication']='654321'; expect(request(admin,'resetpass.php',reset,token)[0],400)
    # Verification is bound to the pending address, not any address supplied later.
    sql("query(\"INSERT INTO auth_codes (user_id,purpose,email,code_hash,expires_at,attempts) VALUES (3,'email','pending@example.test',?,DATE_ADD(NOW(),INTERVAL 10 MINUTE),0)\",[password_hash('654321',PASSWORD_DEFAULT)]);")
    expect(request(staff,'verify_code_Modifer.php',{'id':3,'email':'different@example.test','code':'654321'},staff_token)[0],400)
    expect(request(staff,'verify_code_Modifer.php',{'id':3,'email':'pending@example.test','code':'654321'},staff_token)[0],200)
    expect(request(staff,'verify_code_Modifer.php',{'id':3,'email':'pending@example.test','code':'654321'},staff_token)[0],400)
    expect(request(admin,'getUser.php?id=1')[0],401)
    expect(request(admin,'login.php',{'email':'test0@example.test','password':'NewPassword123!'},token)[0],200)
    # Goal completion works for gaining weight as well as losing it.
    code,result=request(admin,'addGoal.php',{'userId':1,'type':'weight','title':'Gain weight','currentValue':60,'target':65},token); expect(code,201)
    expect(request(admin,'updateGoal.php',{'id':result['goal']['id'],'currentValue':65},token)[0],200)
    assert int(sql("echo rows('SELECT progress FROM Goal ORDER BY id DESC LIMIT 1')[0]['progress'];"))==100; checks+=1
    # Every private route must reject an anonymous session, including admin and PDF.
    anonymous=client(); _,session=request(anonymous,'session.php'); anonymous_token=session['csrfToken']
    public={'session.php','login.php','register.php','forgotPassword.php','resetpass.php','resend_code.php','verify_code.php'}
    for endpoint in sorted((root/'controllers').glob('*.php')):
        if endpoint.name in public: continue
        read=endpoint.name.startswith('get') or endpoint.name=='exportUserReport.php'
        expect(request(anonymous,endpoint.name,None if read else {},anonymous_token)[0],401)
    # A logged-in user cannot fetch another user's health data or export.
    for endpoint in ['getUser.php?id=2','getFoodEntries.php?user_id=2','getExerciseEntries.php?user_id=2','getWeightEntries.php?user_id=2','getGoals.php?user_id=2','getDailyStats.php?user_id=2','getCurrentValue.php?user_id=2','getCalorieStats.php?user_id=2','getMacroStats.php?user_id=2','getMonthlySummary.php?user_id=2','getWeightStats.php?user_id=2','getAppointments.php?user_id=2','exportUserReport.php?user_id=2']:
        expect(request(admin,endpoint)[0],403)
    for endpoint,data in [('addFoodEntry.php',{'userId':2}),('addWeightEntry.php',{'userId':2}),('addExerciseEntry.php',{'userId':2}),('addGoal.php',{'userId':2}),('updateDailyStats.php',{'userId':2}),('updateUserHealth.php',{'id':2}),('updatePassword.php',{'userId':2}),('deleteMyCompet.php',{'userId':2}),('createAppointment.php',{'patient_id':2}),('createSpecialistRequest.php',{'user_id':2})]:
        expect(request(admin,endpoint,data,token)[0],403)
    # Actual roles and ownership govern appointments, regardless of supplied role.
    payload={'patient_id':1,'specialist_id':4,'appointment_date':today,'appointment_time':'12:30','type':'nutrition','reason':'Synthetic test'}
    code,result=request(admin,'createAppointment.php',payload,token); expect(code,201); appointment=result['id']
    specialist=client(); _,session=request(specialist,'session.php'); spec_token=session['csrfToken']
    expect(request(specialist,'login.php',{'email':'test3@example.test','password':'TestPassword123!'},spec_token)[0],200)
    expect(request(admin,'updateAppointmentStatus.php',{'appointment_id':appointment,'new_status':'confirmed'},token)[0],403)
    expect(request(specialist,'updateAppointmentStatus.php',{'appointment_id':appointment,'new_status':'confirmed'},spec_token)[0],200)
    outsider=client(); _,session=request(outsider,'session.php'); outsider_token=session['csrfToken']
    expect(request(outsider,'login.php',{'email':'test4@example.test','password':'TestPassword123!'},outsider_token)[0],200)
    expect(request(outsider,'updateAppointmentStatus.php',{'appointment_id':appointment,'new_status':'confirmed'},outsider_token)[0],404)
    _,result=request(admin,'getAppointments.php?user_id=1&role=specialist'); assert len(result['appointments'])==1; checks+=1
    expect(request(admin,'createSpecialistRequest.php',{'user_id':1},token)[0],201)
    _,requests=request(staff,'getSpecialistRequests.php'); req=requests['requests'][0]['id']
    expect(request(admin,'updateSpecialistRequest.php',{'request_id':req,'new_status':'approved'},token)[0],403)
    expect(request(staff,'updateSpecialistRequest.php',{'request_id':req,'new_status':'approved'},staff_token)[0],200)
    expect(request(staff,'updateSpecialistRequest.php',{'request_id':req,'new_status':'approved'},staff_token)[0],409)
    # PDF export works using only the retained Composer package.
    with admin.open('http://127.0.0.1:8099/exportUserReport.php?user_id=1') as response:
        assert response.headers['Content-Type'].startswith('application/pdf')
        assert response.read().startswith(b'%PDF'); checks+=2
    # Mail failures do not expose account existence in reset requests.
    _,known=request(anonymous,'forgotPassword.php',{'email':'test1@example.test'},anonymous_token)
    _,unknown=request(anonymous,'forgotPassword.php',{'email':'missing@example.test'},anonymous_token)
    assert known==unknown and known['success']; checks+=1
    # CORS and routing protect internal source/configuration paths.
    for path in ['health','config/local.php','database/schema.sql','vendor/autoload.php','controllers/getUser.php']:
        expect(request(anonymous,path)[0],200 if path=='health' else 404)
    for origin,status in [('http://localhost:8080',204),('https://untrusted.example',403)]:
        r=urllib.request.Request('http://127.0.0.1:8099/session.php',method='OPTIONS',headers={'Origin':origin,'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'Content-Type,X-CSRF-Token'})
        try:
            with anonymous.open(r) as response:
                expect(response.status,status)
                assert response.headers['Access-Control-Allow-Origin']==origin
                assert response.headers['Access-Control-Allow-Credentials']=='true'; checks+=2
        except urllib.error.HTTPError as error:
            expect(error.code,status); assert not error.headers.get('Access-Control-Allow-Origin'); checks+=1
    # Missing/expired CSRF tokens are rejected before mutations.
    code,result=request(admin,'addGoal.php',{},'stale-token'); expect(code,403); assert result['code']=='csrf_expired'; checks+=1
    # Account cleanup removes related rows atomically.
    expect(request(admin,'deleteMyCompet.php',{'userId':1,'code':'NewPassword123!'},token)[0],200)
    _,session=request(admin,'session.php'); token=session['csrfToken']
    expect(request(admin,'login.php',{'email':'test1@example.test','password':'TestPassword123!'},token)[0],200)
    expect(request(admin,'updateUserHealth.php',{'id':2,'currentWeight':-1},token)[0],400)
    expect(request(admin,'updateUserHealth.php',{'id':2,'currentWeight':80.75,'goalWeight':70.25,'height':175.5,'goalCalories':2000,'activityLevel':'moderate'},token)[0],200)
    assert float(sql("echo rows('SELECT currentWeight FROM users WHERE id=2')[0]['currentWeight'];"))==80.75; checks+=1
    expect(request(admin,'routes/api.php')[0],404)
    # Verify the Vite same-origin proxy preserves session cookies and CSRF requests.
    front=root.parent/'frontend'
    front_env=dict(env,BACKEND_ORIGIN='http://127.0.0.1:8099',BACKEND_PATH='',VITE_API_URL='http://127.0.0.1:8099')
    vite_log=tempfile.TemporaryFile(mode='w+t')
    vite=subprocess.Popen(['node',str(front/'node_modules/vite/bin/vite.js'),'--host','127.0.0.1','--port','8199','--strictPort'],cwd=front,env=front_env,stdout=vite_log,stderr=subprocess.STDOUT,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
    try:
        proxy=client()
        for attempt in range(200):
            try:
                with proxy.open('http://127.0.0.1:8199/api/session.php',timeout=2) as r: session=json.load(r)
                break
            except (OSError,urllib.error.URLError): time.sleep(.1)
        else:
            vite_log.seek(0)
            raise RuntimeError('Test Vite proxy did not start: ' + vite_log.read()[-4000:])
        assert session['success']; checks+=1
        r=urllib.request.Request('http://127.0.0.1:8199/api/login.php',data=json.dumps({'email':'test1@example.test','password':'TestPassword123!'}).encode(),headers={'Content-Type':'application/json','X-CSRF-Token':session['csrfToken']})
        with proxy.open(r) as response: assert json.load(response)['success']; checks+=1
        with proxy.open('http://127.0.0.1:8199/api/session.php') as response: assert int(json.load(response)['user']['id'])==2; checks+=1
    finally:
        vite.terminate(); vite.wait(timeout=10); vite_log.close()
    print(f'{checks} isolated API authorization, workflow, data integrity and proxy checks passed.')
finally:
    server.terminate(); server.wait(timeout=10)
    # Only remove the uniquely named test database created by this run.
    cleanup="<?php $name=getenv('DB_NAME'); if(!preg_match('/^healthytrack_test_[0-9]+$/',$name)) exit(1); $db=new mysqli('127.0.0.1','root',''); $db->query(\"DROP DATABASE `$name`\");"
    subprocess.run([PHP],input=cleanup,text=True,env=env,check=True)
