
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, WeightEntry, FoodEntry, ExerciseEntry, Goal } from '@/types/health';
import { UserPlus, Filter, Search, DownloadCloud, RefreshCw, Database, TableProperties, Plus, Trash2, Edit, Save, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Mock data for users
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    goalWeight: 75,
    currentWeight: 85,
    height: 180,
    age: 32,
    gender: "Male",
    goalCalories: 2000,
    activityLevel: "Moderate"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    goalWeight: 60,
    currentWeight: 65,
    height: 165,
    age: 28,
    gender: "Female",
    goalCalories: 1800,
    activityLevel: "Active"
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    goalWeight: 80,
    currentWeight: 92,
    height: 185,
    age: 35,
    gender: "Male",
    goalCalories: 2200,
    activityLevel: "Very Active"
  }
];

// Mock data for weight entries
const mockWeightEntries = [
  {
    id: "1",
    weight: 85,
    date: "2025-04-01",
    userId: "1"
  },
  {
    id: "2",
    weight: 84.5,
    date: "2025-04-05",
    userId: "1"
  },
  {
    id: "3",
    weight: 83.8,
    date: "2025-04-10",
    userId: "1"
  },
  {
    id: "4",
    weight: 65,
    date: "2025-04-02",
    userId: "2"
  },
  {
    id: "5",
    weight: 64.2,
    date: "2025-04-09",
    userId: "2"
  }
];

// Mock data for food entries
const mockFoodEntries = [
  {
    id: "1",
    name: "Grilled Chicken Salad",
    calories: 350,
    protein: 30,
    carbs: 15,
    fat: 12,
    date: "2025-04-13",
    userId: "1",
    mealType: "Lunch"
  },
  {
    id: "2",
    name: "Protein Smoothie",
    calories: 250,
    protein: 25,
    carbs: 20,
    fat: 5,
    date: "2025-04-13",
    userId: "1",
    mealType: "Breakfast"
  },
  {
    id: "3",
    name: "Salmon with Vegetables",
    calories: 420,
    protein: 35,
    carbs: 12,
    fat: 22,
    date: "2025-04-12",
    userId: "1",
    mealType: "Dinner"
  }
];

// Mock data for exercise entries
const mockExerciseEntries = [
  {
    id: "1",
    name: "Running",
    caloriesBurned: 450,
    duration: 45,
    date: "2025-04-13",
    userId: "1",
    type: "Cardio"
  },
  {
    id: "2",
    name: "Weight Training",
    caloriesBurned: 300,
    duration: 60,
    date: "2025-04-12",
    userId: "1",
    type: "Strength"
  },
  {
    id: "3",
    name: "Yoga",
    caloriesBurned: 200,
    duration: 45,
    date: "2025-04-11",
    userId: "1",
    type: "Flexibility"
  }
];

// Mock data for goals
const mockGoals = [
  {
    id: "1",
    type: "weight",
    target: 75,
    currentValue: 85,
    deadline: "2025-07-13",
    progress: 30,
    userId: "1"
  },
  {
    id: "2",
    type: "calories",
    target: 2000,
    currentValue: 2200,
    deadline: "2025-05-13",
    progress: 60,
    userId: "1"
  },
  {
    id: "3",
    type: "exercise",
    target: 150,
    currentValue: 90,
    deadline: "2025-06-15",
    progress: 45,
    userId: "1"
  }
];

interface DatabaseTable {
  name: string;
  columns: TableColumn[];
  records: Record<string, any>[];
}

interface TableColumn {
  name: string;
  type: string;
  constraints: string[];
}

interface Database {
  name: string;
  tables: DatabaseTable[];
}

const mockDatabases: Database[] = [
  {
    name: "HealthyTrackdb",
    tables: [
      {
        name: "users",
        columns: [
          { name: "id", type: "INT", constraints: ["PRIMARY KEY", "AUTO_INCREMENT"] },
          { name: "name", type: "VARCHAR(30)", constraints: ["NOT NULL"] },
          { name: "email", type: "VARCHAR(50)", constraints: ["NOT NULL"] },
          { name: "reg_date", type: "TIMESTAMP", constraints: ["DEFAULT CURRENT_TIMESTAMP"] },
          { name: "goalWeight", type: "INT", constraints: ["NOT NULL"] },
          { name: "currentWeight", type: "INT", constraints: ["NOT NULL"] },
          { name: "height", type: "INT", constraints: ["NOT NULL"] },
          { name: "age", type: "INT", constraints: ["NOT NULL"] },
          { name: "gender", type: "VARCHAR(10)", constraints: ["NOT NULL"] },
          { name: "goalCalories", type: "INT", constraints: ["NOT NULL"] },
          { name: "activityLevel", type: "VARCHAR(20)", constraints: ["NOT NULL"] }
        ],
        records: mockUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          goalWeight: user.goalWeight,
          currentWeight: user.currentWeight,
          height: user.height,
          age: user.age,
          gender: user.gender,
          goalCalories: user.goalCalories,
          activityLevel: user.activityLevel
        }))
      },
      {
        name: "foodEntry",
        columns: [
          { name: "id", type: "INT", constraints: ["PRIMARY KEY", "AUTO_INCREMENT"] },
          { name: "name", type: "VARCHAR(50)", constraints: ["NOT NULL"] },
          { name: "calories", type: "INT", constraints: ["NOT NULL"] },
          { name: "protein", type: "INT", constraints: ["NOT NULL"] },
          { name: "carbs", type: "INT", constraints: ["NOT NULL"] },
          { name: "fats", type: "INT", constraints: ["NOT NULL"] },
          { name: "date", type: "DATE", constraints: ["NOT NULL"] },
          { name: "user_id", type: "INT", constraints: ["NOT NULL", "FOREIGN KEY"] },
          { name: "maleTaype", type: "VARCHAR(15)", constraints: ["NOT NULL"] }
        ],
        records: mockFoodEntries.map(entry => ({
          id: entry.id,
          name: entry.name,
          calories: entry.calories,
          protein: entry.protein,
          carbs: entry.carbs,
          fat: entry.fat,
          date: entry.date,
          user_id: "1",
          maleTaype: entry.mealType
        }))
      },
      {
        name: "exerciseEntry",
        columns: [
          { name: "id", type: "INT", constraints: ["PRIMARY KEY", "AUTO_INCREMENT"] },
          { name: "name", type: "VARCHAR(50)", constraints: ["NOT NULL"] },
          { name: "caloriesBurned", type: "INT", constraints: ["NOT NULL"] },
          { name: "duration", type: "INT", constraints: ["NOT NULL"] },
          { name: "date", type: "DATE", constraints: ["NOT NULL"] },
          { name: "user_id", type: "INT", constraints: ["NOT NULL", "FOREIGN KEY"] },
          { name: "type", type: "VARCHAR(15)", constraints: ["NOT NULL"] }
        ],
        records: mockExerciseEntries.map(entry => ({
          id: entry.id,
          name: entry.name,
          caloriesBurned: entry.caloriesBurned,
          duration: entry.duration,
          date: entry.date,
          user_id: "1",
          type: entry.type
        }))
      },
      {
        name: "weightEntry",
        columns: [
          { name: "id", type: "INT", constraints: ["PRIMARY KEY", "AUTO_INCREMENT"] },
          { name: "weight", type: "INT", constraints: ["NOT NULL"] },
          { name: "date", type: "DATE", constraints: ["NOT NULL"] },
          { name: "user_id", type: "INT", constraints: ["NOT NULL", "FOREIGN KEY"] }
        ],
        records: mockWeightEntries.map(entry => ({
          id: entry.id,
          weight: entry.weight,
          date: entry.date,
          user_id: "1"
        }))
      },
      {
        name: "Goal",
        columns: [
          { name: "id", type: "INT", constraints: ["PRIMARY KEY", "AUTO_INCREMENT"] },
          { name: "type", type: "VARCHAR(50)", constraints: ["NOT NULL"] },
          { name: "target", type: "INT", constraints: ["NOT NULL"] },
          { name: "startDate", type: "DATE", constraints: ["NOT NULL"] },
          { name: "endDate", type: "DATE", constraints: ["NOT NULL"] },
          { name: "user_id", type: "INT", constraints: ["NOT NULL", "FOREIGN KEY"] },
          { name: "status", type: "VARCHAR(20)", constraints: ["NOT NULL"] },
          { name: "progress", type: "INT", constraints: ["NOT NULL"] }
        ],
        records: mockGoals.map(goal => ({
          id: goal.id,
          type: goal.type,
          target: goal.target,
          startDate: "2025-01-01",
          endDate: goal.deadline,
          user_id: "1",
          status: goal.progress < 100 ? "In Progress" : "Complete",
          progress: goal.progress
        }))
      },
      {
        name: "mealPlan",
        columns: [
          { name: "id", type: "INT", constraints: ["PRIMARY KEY", "AUTO_INCREMENT"] },
          { name: "name", type: "VARCHAR(50)", constraints: ["NOT NULL"] },
          { name: "calories", type: "INT", constraints: ["NOT NULL"] },
          { name: "protein", type: "INT", constraints: ["NOT NULL"] },
          { name: "carbs", type: "INT", constraints: ["NOT NULL"] },
          { name: "fats", type: "INT", constraints: ["NOT NULL"] },
          { name: "date", type: "DATE", constraints: ["NOT NULL"] },
          { name: "user_id", type: "INT", constraints: ["NOT NULL", "FOREIGN KEY"] }
        ],
        records: []
      },
      {
        name: "DialyStats",
        columns: [
          { name: "id", type: "INT", constraints: ["PRIMARY KEY", "AUTO_INCREMENT"] },
          { name: "date", type: "DATE", constraints: ["NOT NULL"] },
          { name: "user_id", type: "INT", constraints: ["NOT NULL", "FOREIGN KEY"] },
          { name: "caloriesConsumed", type: "INT", constraints: ["NOT NULL"] },
          { name: "caloriesBurned", type: "INT", constraints: ["NOT NULL"] },
          { name: "weight", type: "INT", constraints: ["NOT NULL"] },
          { name: "exerciseMinutes", type: "INT", constraints: ["NOT NULL"] }
        ],
        records: []
      }
    ]
  }
];

const AdminContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('database');
  const [databases, setDatabases] = useState<Database[]>(mockDatabases);
  const [selectedDatabase, setSelectedDatabase] = useState<Database | null>(databases[0]);
  const [selectedTable, setSelectedTable] = useState<DatabaseTable | null>(databases[0]?.tables[0] || null);
  const [isNewDatabaseDialogOpen, setIsNewDatabaseDialogOpen] = useState(false);
  const [isNewTableDialogOpen, setIsNewTableDialogOpen] = useState(false);
  const [isNewColumnDialogOpen, setIsNewColumnDialogOpen] = useState(false);
  const [isEditRecordDialogOpen, setIsEditRecordDialogOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Record<string, any> | null>(null);
  const [newDatabaseName, setNewDatabaseName] = useState('');
  const [newTableName, setNewTableName] = useState('');
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState('VARCHAR(50)');
  const [newColumnConstraints, setNewColumnConstraints] = useState<string[]>([]);
  
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateDatabase = () => {
    if (!newDatabaseName.trim()) {
      toast.error("Database name cannot be empty");
      return;
    }
    
    const newDatabase: Database = {
      name: newDatabaseName,
      tables: []
    };
    
    setDatabases([...databases, newDatabase]);
    setSelectedDatabase(newDatabase);
    setIsNewDatabaseDialogOpen(false);
    setNewDatabaseName('');
    toast.success(`Database ${newDatabaseName} created successfully`);
  };

  const handleCreateTable = () => {
    if (!selectedDatabase) {
      toast.error("Please select a database first");
      return;
    }
    
    if (!newTableName.trim()) {
      toast.error("Table name cannot be empty");
      return;
    }
    
    const newTable: DatabaseTable = {
      name: newTableName,
      columns: [
        { name: "id", type: "INT", constraints: ["PRIMARY KEY", "AUTO_INCREMENT"] }
      ],
      records: []
    };
    
    const updatedDatabase = {
      ...selectedDatabase,
      tables: [...selectedDatabase.tables, newTable]
    };
    
    setDatabases(databases.map(db => 
      db.name === selectedDatabase.name ? updatedDatabase : db
    ));
    
    setSelectedDatabase(updatedDatabase);
    setSelectedTable(newTable);
    setIsNewTableDialogOpen(false);
    setNewTableName('');
    toast.success(`Table ${newTableName} created successfully`);
  };

  const handleAddColumn = () => {
    if (!selectedTable || !selectedDatabase) {
      toast.error("Please select a table first");
      return;
    }
    
    if (!newColumnName.trim()) {
      toast.error("Column name cannot be empty");
      return;
    }
    
    const newColumn: TableColumn = {
      name: newColumnName,
      type: newColumnType,
      constraints: newColumnConstraints
    };
    
    const updatedTable = {
      ...selectedTable,
      columns: [...selectedTable.columns, newColumn]
    };
    
    const updatedDatabase = {
      ...selectedDatabase,
      tables: selectedDatabase.tables.map(table => 
        table.name === selectedTable.name ? updatedTable : table
      )
    };
    
    setDatabases(databases.map(db => 
      db.name === selectedDatabase.name ? updatedDatabase : db
    ));
    
    setSelectedDatabase(updatedDatabase);
    setSelectedTable(updatedTable);
    setIsNewColumnDialogOpen(false);
    setNewColumnName('');
    setNewColumnType('VARCHAR(50)');
    setNewColumnConstraints([]);
    toast.success(`Column ${newColumnName} added successfully to ${selectedTable.name}`);
  };

  const handleDeleteTable = (tableName: string) => {
    if (!selectedDatabase) return;
    
    const updatedDatabase = {
      ...selectedDatabase,
      tables: selectedDatabase.tables.filter(table => table.name !== tableName)
    };
    
    setDatabases(databases.map(db => 
      db.name === selectedDatabase.name ? updatedDatabase : db
    ));
    
    setSelectedDatabase(updatedDatabase);
    setSelectedTable(updatedDatabase.tables[0] || null);
    toast.success(`Table ${tableName} deleted successfully`);
  };

  const handleDeleteColumn = (columnName: string) => {
    if (!selectedTable || !selectedDatabase) return;
    
    if (columnName === "id") {
      toast.error("Cannot delete primary key column");
      return;
    }
    
    const updatedTable = {
      ...selectedTable,
      columns: selectedTable.columns.filter(column => column.name !== columnName)
    };
    
    const updatedDatabase = {
      ...selectedDatabase,
      tables: selectedDatabase.tables.map(table => 
        table.name === selectedTable.name ? updatedTable : table
      )
    };
    
    setDatabases(databases.map(db => 
      db.name === selectedDatabase.name ? updatedDatabase : db
    ));
    
    setSelectedDatabase(updatedDatabase);
    setSelectedTable(updatedTable);
    toast.success(`Column ${columnName} deleted successfully from ${selectedTable.name}`);
  };

  const handleAddRecord = () => {
    if (!selectedTable || !selectedDatabase) return;
    
    const newRecord: Record<string, any> = {};
    
    selectedTable.columns.forEach(column => {
      if (column.name === "id") {
        const maxId = selectedTable.records.length > 0 
          ? Math.max(...selectedTable.records.map(record => parseInt(record.id)))
          : 0;
        newRecord.id = (maxId + 1).toString();
      } else if (column.type.includes("VARCHAR")) {
        newRecord[column.name] = "";
      } else if (column.type.includes("INT")) {
        newRecord[column.name] = 0;
      } else if (column.type.includes("DATE")) {
        newRecord[column.name] = new Date().toISOString().split('T')[0];
      } else {
        newRecord[column.name] = "";
      }
    });
    
    setCurrentRecord(newRecord);
    setIsEditRecordDialogOpen(true);
  };

  const handleSaveRecord = () => {
    if (!selectedTable || !selectedDatabase || !currentRecord) return;
    
    const updatedTable = {
      ...selectedTable,
      records: [...selectedTable.records, currentRecord]
    };
    
    const updatedDatabase = {
      ...selectedDatabase,
      tables: selectedDatabase.tables.map(table => 
        table.name === selectedTable.name ? updatedTable : table
      )
    };
    
    setDatabases(databases.map(db => 
      db.name === selectedDatabase.name ? updatedDatabase : db
    ));
    
    setSelectedDatabase(updatedDatabase);
    setSelectedTable(updatedTable);
    setIsEditRecordDialogOpen(false);
    setCurrentRecord(null);
    toast.success(`Record added successfully to ${selectedTable.name}`);
  };

  const handleDeleteRecord = (recordId: string) => {
    if (!selectedTable || !selectedDatabase) return;
    
    const updatedTable = {
      ...selectedTable,
      records: selectedTable.records.filter(record => record.id !== recordId)
    };
    
    const updatedDatabase = {
      ...selectedDatabase,
      tables: selectedDatabase.tables.map(table => 
        table.name === selectedTable.name ? updatedTable : table
      )
    };
    
    setDatabases(databases.map(db => 
      db.name === selectedDatabase.name ? updatedDatabase : db
    ));
    
    setSelectedDatabase(updatedDatabase);
    setSelectedTable(updatedTable);
    toast.success(`Record deleted successfully from ${selectedTable.name}`);
  };

  const handleEditRecord = (record: Record<string, any>) => {
    setCurrentRecord({...record});
    setIsEditRecordDialogOpen(true);
  };

  const updateRecordField = (field: string, value: any) => {
    if (!currentRecord) return;
    setCurrentRecord({
      ...currentRecord,
      [field]: value
    });
  };

  return (
    <div className="flex-1 ml-64">
      <div className="container p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm" variant="outline">
              <DownloadCloud className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
          <Button className="shrink-0">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <Tabs defaultValue="database" onValueChange={setCurrentTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="database">Database Management</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="food">Food Entries</TabsTrigger>
            <TabsTrigger value="exercises">Exercise Entries</TabsTrigger>
            <TabsTrigger value="weight">Weight Entries</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="mealplans">Meal Plans</TabsTrigger>
            <TabsTrigger value="stats">Daily Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="database">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Databases</span>
                    <Dialog open={isNewDatabaseDialogOpen} onOpenChange={setIsNewDatabaseDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Database</DialogTitle>
                          <DialogDescription>
                            Enter a name for your new database.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="name" className="text-right">
                              Name
                            </label>
                            <Input
                              id="name"
                              value={newDatabaseName}
                              onChange={(e) => setNewDatabaseName(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={handleCreateDatabase}>Create Database</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {databases.map(database => (
                      <div 
                        key={database.name}
                        className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${
                          selectedDatabase?.name === database.name ? 'bg-accent' : 'hover:bg-muted'
                        }`}
                        onClick={() => setSelectedDatabase(database)}
                      >
                        <div className="flex items-center">
                          <Database className="h-4 w-4 mr-2" />
                          <span>{database.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                {selectedDatabase ? (
                  <>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>{selectedDatabase.name} Tables</span>
                        <Dialog open={isNewTableDialogOpen} onOpenChange={setIsNewTableDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              New Table
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create New Table</DialogTitle>
                              <DialogDescription>
                                Enter a name for your new table.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="tableName" className="text-right">
                                  Name
                                </label>
                                <Input
                                  id="tableName"
                                  value={newTableName}
                                  onChange={(e) => setNewTableName(e.target.value)}
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" onClick={handleCreateTable}>Create Table</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardTitle>
                      <CardDescription>
                        Select a table to view or edit its structure and data
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedDatabase.tables.map(table => (
                          <div 
                            key={table.name}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedTable?.name === table.name ? 'border-primary bg-accent/50' : 'hover:bg-accent/10'
                            }`}
                            onClick={() => setSelectedTable(table)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex flex-col">
                                <div className="flex items-center mb-2">
                                  <TableProperties className="h-5 w-5 mr-2 text-primary" />
                                  <span className="font-medium">{table.name}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {table.columns.length} Columns • {table.records.length} Records
                                </span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTable(table.name);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="flex flex-col items-center justify-center h-64">
                    <Database className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Select a database to view its tables</p>
                  </CardContent>
                )}
              </Card>

              {selectedTable && (
                <Card className="md:col-span-4">
                  <CardHeader>
                    <CardTitle>
                      {selectedTable.name}
                    </CardTitle>
                    <CardDescription>
                      Manage table structure and data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="structure">
                      <TabsList className="mb-4">
                        <TabsTrigger value="structure">Structure</TabsTrigger>
                        <TabsTrigger value="data">Data</TabsTrigger>
                      </TabsList>

                      <TabsContent value="structure">
                        <div className="flex justify-between mb-4">
                          <h3 className="text-lg font-medium">Columns</h3>
                          <Dialog open={isNewColumnDialogOpen} onOpenChange={setIsNewColumnDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Column
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add New Column</DialogTitle>
                                <DialogDescription>
                                  Define the new column for your table.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <label htmlFor="columnName" className="text-right">
                                    Name
                                  </label>
                                  <Input
                                    id="columnName"
                                    value={newColumnName}
                                    onChange={(e) => setNewColumnName(e.target.value)}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <label htmlFor="columnType" className="text-right">
                                    Type
                                  </label>
                                  <Select value={newColumnType} onValueChange={setNewColumnType}>
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder="Select column type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="VARCHAR(50)">VARCHAR(50)</SelectItem>
                                      <SelectItem value="VARCHAR(255)">VARCHAR(255)</SelectItem>
                                      <SelectItem value="INT">INT</SelectItem>
                                      <SelectItem value="FLOAT">FLOAT</SelectItem>
                                      <SelectItem value="DATE">DATE</SelectItem>
                                      <SelectItem value="DATETIME">DATETIME</SelectItem>
                                      <SelectItem value="TEXT">TEXT</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <label className="text-right">
                                    Constraints
                                  </label>
                                  <div className="col-span-3 flex flex-wrap gap-2">
                                    <Button
                                      type="button"
                                      variant={newColumnConstraints.includes("NOT NULL") ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => {
                                        if (newColumnConstraints.includes("NOT NULL")) {
                                          setNewColumnConstraints(newColumnConstraints.filter(c => c !== "NOT NULL"));
                                        } else {
                                          setNewColumnConstraints([...newColumnConstraints, "NOT NULL"]);
                                        }
                                      }}
                                    >
                                      NOT NULL
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={newColumnConstraints.includes("UNIQUE") ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => {
                                        if (newColumnConstraints.includes("UNIQUE")) {
                                          setNewColumnConstraints(newColumnConstraints.filter(c => c !== "UNIQUE"));
                                        } else {
                                          setNewColumnConstraints([...newColumnConstraints, "UNIQUE"]);
                                        }
                                      }}
                                    >
                                      UNIQUE
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={newColumnConstraints.includes("DEFAULT NULL") ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => {
                                        if (newColumnConstraints.includes("DEFAULT NULL")) {
                                          setNewColumnConstraints(newColumnConstraints.filter(c => c !== "DEFAULT NULL"));
                                        } else {
                                          setNewColumnConstraints([...newColumnConstraints, "DEFAULT NULL"]);
                                        }
                                      }}
                                    >
                                      DEFAULT NULL
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit" onClick={handleAddColumn}>Add Column</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Constraints</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedTable.columns.map(column => (
                              <TableRow key={column.name}>
                                <TableCell className="font-medium">{column.name}</TableCell>
                                <TableCell>{column.type}</TableCell>
                                <TableCell>{column.constraints.join(", ")}</TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    disabled={column.name === "id"}
                                    onClick={() => handleDeleteColumn(column.name)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TabsContent>

                      <TabsContent value="data">
                        <div className="flex justify-between mb-4">
                          <h3 className="text-lg font-medium">Records</h3>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleAddRecord}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Record
                          </Button>
                        </div>

                        <div className="rounded-md border overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {selectedTable.columns.map(column => (
                                  <TableHead key={column.name}>{column.name}</TableHead>
                                ))}
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedTable.records.length > 0 ? (
                                selectedTable.records.map((record, index) => (
                                  <TableRow key={index}>
                                    {selectedTable.columns.map(column => (
                                      <TableCell key={column.name}>
                                        {String(record[column.name] || '')}
                                      </TableCell>
                                    ))}
                                    <TableCell className="text-right">
                                      <div className="flex justify-end gap-2">
                                        <Button 
                                          variant="ghost" 
                                          size="icon"
                                          onClick={() => handleEditRecord(record)}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="icon"
                                          onClick={() => handleDeleteRecord(record.id)}
                                        >
                                          <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={selectedTable.columns.length + 1} className="text-center py-8">
                                    <div className="flex flex-col items-center justify-center">
                                      <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                                      <p className="text-muted-foreground">No records found</p>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>

            <Dialog open={isEditRecordDialogOpen} onOpenChange={setIsEditRecordDialogOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{currentRecord?.id ? 'Edit Record' : 'Add New Record'}</DialogTitle>
                  <DialogDescription>
                    Enter the values for each field of the record.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                  {selectedTable && currentRecord && selectedTable.columns.map(column => (
                    <div key={column.name} className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor={column.name} className="text-right font-medium">
                        {column.name}
                      </label>
                      <div className="col-span-3">
                        {column.name === 'id' ? (
                          <Input
                            id={column.name}
                            value={currentRecord[column.name] || ''}
                            disabled
                          />
                        ) : column.type.includes('DATE') ? (
                          <Input
                            id={column.name}
                            type="date"
                            value={currentRecord[column.name] || ''}
                            onChange={(e) => updateRecordField(column.name, e.target.value)}
                          />
                        ) : column.type.includes('INT') || column.type.includes('FLOAT') ? (
                          <Input
                            id={column.name}
                            type="number"
                            value={currentRecord[column.name] || 0}
                            onChange={(e) => updateRecordField(column.name, e.target.value)}
                          />
                        ) : (
                          <Input
                            id={column.name}
                            value={currentRecord[column.name] || ''}
                            onChange={(e) => updateRecordField(column.name, e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditRecordDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveRecord}>
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
                <CardDescription>Manage all registered users in the system.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>A list of all users in the system.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Current Weight</TableHead>
                      <TableHead>Goal Weight</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Activity Level</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.currentWeight} kg</TableCell>
                        <TableCell>{user.goalWeight} kg</TableCell>
                        <TableCell>{user.age}</TableCell>
                        <TableCell>{user.gender}</TableCell>
                        <TableCell>{user.activityLevel}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="food">
            <Card>
              <CardHeader>
                <CardTitle>Food Entries</CardTitle>
                <CardDescription>Manage all food entries in the system.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>A list of all food entries.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Calories</TableHead>
                      <TableHead>Protein</TableHead>
                      <TableHead>Carbs</TableHead>
                      <TableHead>Fat</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Meal Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockFoodEntries.map(food => (
                      <TableRow key={food.id}>
                        <TableCell className="font-medium">{food.id}</TableCell>
                        <TableCell>{food.name}</TableCell>
                        <TableCell>{food.calories} kcal</TableCell>
                        <TableCell>{food.protein}g</TableCell>
                        <TableCell>{food.carbs}g</TableCell>
                        <TableCell>{food.fat}g</TableCell>
                        <TableCell>{food.date}</TableCell>
                        <TableCell>{food.mealType}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exercises">
            <Card>
              <CardHeader>
                <CardTitle>Exercise Entries</CardTitle>
                <CardDescription>Manage all exercise entries in the system.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>A list of all exercise entries.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Calories Burned</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockExerciseEntries.map(exercise => (
                      <TableRow key={exercise.id}>
                        <TableCell className="font-medium">{exercise.id}</TableCell>
                        <TableCell>{exercise.name}</TableCell>
                        <TableCell>{exercise.duration} min</TableCell>
                        <TableCell>{exercise.caloriesBurned} kcal</TableCell>
                        <TableCell>{exercise.type}</TableCell>
                        <TableCell>{exercise.date}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weight">
            <Card>
              <CardHeader>
                <CardTitle>Weight Entries</CardTitle>
                <CardDescription>Manage all weight tracking entries in the system.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>A list of all weight entries.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockWeightEntries.map(entry => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.id}</TableCell>
                        <TableCell>{entry.weight} kg</TableCell>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals">
            <Card>
              <CardHeader>
                <CardTitle>Goals</CardTitle>
                <CardDescription>Manage all user goals in the system.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>A list of all goals.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Current Value</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockGoals.map(goal => (
                      <TableRow key={goal.id}>
                        <TableCell className="font-medium">{goal.id}</TableCell>
                        <TableCell>{goal.type}</TableCell>
                        <TableCell>{goal.target} {goal.type === 'weight' ? 'kg' : 'kcal'}</TableCell>
                        <TableCell>{goal.currentValue} {goal.type === 'weight' ? 'kg' : 'kcal'}</TableCell>
                        <TableCell>{goal.deadline}</TableCell>
                        <TableCell>{goal.progress}%</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mealplans">
            <Card>
              <CardHeader>
                <CardTitle>Meal Plans</CardTitle>
                <CardDescription>Manage all meal plans in the system.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">No meal plans available yet.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Daily Stats</CardTitle>
                <CardDescription>View all daily statistics in the system.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">No daily stats available yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const AdminPage = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <AdminContent />
    </div>
  );
};

export default AdminPage;
