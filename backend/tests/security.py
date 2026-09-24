import json, os, subprocess, time, urllib.request, urllib.error, http.cookiejar
from pathlib import Path
root=Path(__file__).resolve().parents[1]
env=dict(os.environ, DB_NAME='healthytrack_test_' + str(int(time.time())), DB_HOST='127.0.0.1', SMTP_USER='', SMTP_PASSWORD='', SMTP_FROM='')
subprocess.run(['php',str(root/'tests/prepare.php')],env=env,check=True)
server=subprocess.Popen(['php','-S','127.0.0.1:8099','-t',str(root),str(root/'tests/router.php')],env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
checks=0
try:
    time.sleep(1)
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
    expect(request(c,'guard/getUser.php?id=1')[0],401)
    _,session=request(c,'controllers/session.php'); token=session['csrfToken']
    expect(request(c,'controllers/login.php',{'email':'test0@example.test','password':'TestPassword123!'})[0],403)
    expect(request(c,'controllers/login.php',{'email':'test0@example.test','password':'TestPassword123!'},token)[0],200)
    expect(request(c,'guard/getUser.php?id=1')[0],200)
    expect(request(c,'guard/getUser.php?id=2')[0],403)
    expect(request(c,'guard/updateUser.php',{'id':2},token)[0],403)
    expect(request(c,'guard/getSpecialistRequests.php')[0],403)
    expect(request(c,'guard/updateSpecialistRequest.php',{'request_id':1,'new_status':'approved'},token)[0],403)
    expect(request(c,'guard/deleteGoal.php',{'goalId':999},token)[0],404)
    expect(request(c,'guard/updateAppointmentStatus.php',{'appointment_id':1,'new_status':'confirmed'},token)[0],403)
    expect(request(c,'controllers/logout.php',{},token)[0],200)
    expect(request(c,'guard/getUser.php?id=1')[0],401)
    admin=client(); _,session=request(admin,'controllers/session.php'); token=session['csrfToken']
    expect(request(admin,'controllers/login.php',{'email':'test2@example.test','password':'TestPassword123!'},token)[0],200)
    expect(request(admin,'guard/getSpecialistRequests.php')[0],200)
    expect(request(admin,'guard/updateSpecialistRequest.php',{'request_id':1,'new_status':'invalid'},token)[0],400)
    # Exercise actual endpoints only against the isolated synthetic database.
    def sql(script):
        prefix="<?php require " + json.dumps(str(root/'helpers/database.php').replace(chr(92),'/')) + "; "
        r=subprocess.run(['php'],input=prefix+script,text=True,capture_output=True,env=env)
        if r.returncode: raise RuntimeError(r.stdout+r.stderr)
        return r.stdout.strip()
    today=time.strftime('%Y-%m-%d')
    payload={'userId':1,'type':'weight','title':'Lose weight','currentValue':80.5,'target':70,'deadline':today}
    code,result=request(admin,'controllers/addGoal.php',payload,token); expect(code,201); goal=result['goal']['id']
    code,_=request(admin,'controllers/addWeightEntry.php',{'userId':1,'weight':75.25,'date':today},token); expect(code,201)
    code,goals=request(admin,'controllers/getGoals.php?user_id=1'); expect(code,200)
    assert float(goals['goals'][0]['currentValue'])==75.25
    assert 0<float(goals['goals'][0]['progress'])<100
    checks+=2
    code,_=request(admin,'controllers/addFoodEntry.php',{'userId':1,'name':'Test meal','maleType':'lunch','calories':500,'protein':20.5,'date':today},token); expect(code,201)
    code,_=request(admin,'controllers/addExerciseEntry.php',{'userId':1,'name':'Test walk','type':'cardio','duration':30,'caloriesBurned':100,'date':today},token); expect(code,201)
    code,result=request(admin,'controllers/getExerciseEntries.php?user_id=1'); expect(code,200); assert len(result['entries'])==1; checks+=1
    for _ in range(2): expect(request(admin,'controllers/updateDailyStats.php',{'userId':1,'date':today,'caloriesConsumed':9999},token)[0],200)
    code,stats=request(admin,'controllers/getDailyStats.php?user_id=1'); expect(code,200)
    assert int(stats['data']['caloriesConsumed'])==500 and int(stats['data']['caloriesBurned'])==100
    assert float(stats['data']['currentWeight'])==75.25; checks+=2
    expect(request(admin,'controllers/addFoodEntry.php',{'userId':1,'name':'Second meal','maleType':'dinner','calories':300,'date':today},token)[0],201)
    code,report=request(admin,'controllers/getCalorieStats.php?user_id=1'); expect(code,200)
    assert report['data'][-1]['calories']==800; checks+=1
    code,report=request(admin,'controllers/getMonthlySummary.php?user_id=1'); expect(code,200)
    assert report['data']['avgCalories']==800; checks+=1
    # Force a later write to fail and prove the earlier entry insert rolls back.
    before=sql("echo rows('SELECT COUNT(*) AS n FROM foodEntry')[0]['n'];")
    sql("Database::connect()->query(\"CREATE TRIGGER reject_test_stats BEFORE INSERT ON DailyStats FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='test rollback'\");")
    expect(request(admin,'controllers/addFoodEntry.php',{'userId':1,'name':'Must rollback','maleType':'lunch','calories':50,'date':today},token)[0],500)
    sql('Database::connect()->query("DROP TRIGGER reject_test_stats");')
    assert before==sql("echo rows('SELECT COUNT(*) AS n FROM foodEntry')[0]['n'];"); checks+=1
    # Reset codes are purpose-bound, expire, have an attempt budget, and cannot be reused.
    sql("query(\"INSERT INTO auth_codes (user_id,purpose,email,code_hash,expires_at,attempts) VALUES (1,'reset','test0@example.test',?,DATE_ADD(NOW(),INTERVAL 10 MINUTE),0)\",[password_hash('123456',PASSWORD_DEFAULT)]);")
    reset={'email':'test0@example.test','code_viryfication':'123456','password':'NewPassword123!'}
    expect(request(admin,'controllers/resetpass.php',reset,token)[0],200)
    expect(request(admin,'controllers/resetpass.php',reset,token)[0],400)
    # Missing SMTP configuration must produce one JSON response, with no partial profile write.
    expect(request(admin,'controllers/updateUser.php',{'id':3,'name':'Changed','birthdate':'1995-01-01','email':'new@example.test'},token)[0],503)
    assert sql("echo rows('SELECT name FROM users WHERE id=3')[0]['name'];")=='Test 2'; checks+=1
    # Expiration and failed-attempt limits are enforced independently of session state.
    sql("query(\"INSERT INTO auth_codes (user_id,purpose,email,code_hash,expires_at,attempts) VALUES (1,'reset','test0@example.test',?,DATE_SUB(NOW(),INTERVAL 1 MINUTE),0)\",[password_hash('654321',PASSWORD_DEFAULT)]);")
    reset['code_viryfication']='654321'
    expect(request(admin,'controllers/resetpass.php',reset,token)[0],400)
    sql("query(\"UPDATE auth_codes SET expires_at=DATE_ADD(NOW(),INTERVAL 10 MINUTE), attempts=0 WHERE user_id=1 AND purpose='reset'\");")
    for _ in range(5):
        reset['code_viryfication']='000000'; expect(request(admin,'controllers/resetpass.php',reset,token)[0],400)
    reset['code_viryfication']='654321'; expect(request(admin,'controllers/resetpass.php',reset,token)[0],400)
    # Verification is bound to the pending address, not any address supplied later.
    sql("query(\"INSERT INTO auth_codes (user_id,purpose,email,code_hash,expires_at,attempts) VALUES (3,'email','pending@example.test',?,DATE_ADD(NOW(),INTERVAL 10 MINUTE),0)\",[password_hash('654321',PASSWORD_DEFAULT)]);")
    expect(request(admin,'controllers/verify_code_Modifer.php',{'id':3,'email':'different@example.test','code':'654321'},token)[0],400)
    expect(request(admin,'controllers/verify_code_Modifer.php',{'id':3,'email':'pending@example.test','code':'654321'},token)[0],200)
    expect(request(admin,'controllers/verify_code_Modifer.php',{'id':3,'email':'pending@example.test','code':'654321'},token)[0],400)
    # Goal completion works for gaining weight as well as losing it.
    code,result=request(admin,'controllers/addGoal.php',{'userId':1,'type':'weight','title':'Gain weight','currentValue':60,'target':65},token); expect(code,201)
    expect(request(admin,'controllers/updateGoal.php',{'id':result['goal']['id'],'currentValue':65},token)[0],200)
    assert int(sql("echo rows('SELECT progress FROM Goal ORDER BY id DESC LIMIT 1')[0]['progress'];"))==100; checks+=1
    # Account cleanup removes related rows atomically.
    expect(request(admin,'controllers/deleteMyCompet.php',{'userId':1,'code':'NewPassword123!'},token)[0],200)
    expect(request(admin,'controllers/updateUserHealth.php',{'id':2,'currentWeight':-1},token)[0],400)
    expect(request(admin,'controllers/updateUserHealth.php',{'id':2,'currentWeight':80.75,'goalWeight':70.25,'height':175.5,'goalCalories':2000,'activityLevel':'moderate'},token)[0],200)
    assert float(sql("echo rows('SELECT currentWeight FROM users WHERE id=2')[0]['currentWeight'];"))==80.75; checks+=1
    expect(request(admin,'routes/api.php')[0],410)
    # Verify the Vite same-origin proxy preserves session cookies and CSRF requests.
    front=root.parent/'frontend'
    front_env=dict(env,BACKEND_ORIGIN='http://127.0.0.1:8099',BACKEND_PATH='/controllers')
    vite=subprocess.Popen(['node',str(front/'node_modules/vite/bin/vite.js'),'--host','127.0.0.1','--port','8199','--strictPort'],cwd=front,env=front_env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
    try:
        proxy=client()
        for attempt in range(100):
            try:
                with proxy.open('http://127.0.0.1:8199/api/session.php',timeout=2) as r: session=json.load(r)
                break
            except (OSError,urllib.error.URLError): time.sleep(.1)
        else: raise RuntimeError('Test Vite proxy did not start')
        assert session['success']; checks+=1
        r=urllib.request.Request('http://127.0.0.1:8199/api/login.php',data=json.dumps({'email':'test1@example.test','password':'TestPassword123!'}).encode(),headers={'Content-Type':'application/json','X-CSRF-Token':session['csrfToken']})
        with proxy.open(r) as response: assert json.load(response)['success']; checks+=1
        with proxy.open('http://127.0.0.1:8199/api/session.php') as response: assert int(json.load(response)['user']['id'])==2; checks+=1
    finally:
        vite.terminate(); vite.wait(timeout=10)
    print(f'{checks} isolated security/helper, data integrity and proxy checks passed. Global guard integration remains pending.')
finally:
    server.terminate(); server.wait(timeout=10)
    # Only remove the uniquely named test database created by this run.
    cleanup="<?php $name=getenv('DB_NAME'); if(!preg_match('/^healthytrack_test_[0-9]+$/',$name)) exit(1); $db=new mysqli('127.0.0.1','root',''); $db->query(\"DROP DATABASE `$name`\");"
    subprocess.run(['php'],input=cleanup,text=True,env=env,check=True)
