
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Laptop } from "lucide-react";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sun className="mr-2 h-5 w-5 text-primary" />
          Appearance
        </CardTitle>
        <CardDescription>Customize the application theme</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className={`flex flex-col items-center space-y-2 rounded-md border p-4 ${theme === "light" ? "border-primary" : "border-border"}`}>
            <RadioGroupItem value="light" id="light" className="sr-only" />
            <Sun className="h-6 w-6" />
            <Label htmlFor="light" className="cursor-pointer">Light</Label>
            <span className="text-xs text-muted-foreground">Use light theme</span>
          </div>

          <div className={`flex flex-col items-center space-y-2 rounded-md border p-4 ${theme === "dark" ? "border-primary" : "border-border"}`}>
            <RadioGroupItem value="dark" id="dark" className="sr-only" />
            <Moon className="h-6 w-6" />
            <Label htmlFor="dark" className="cursor-pointer">Dark</Label>
            <span className="text-xs text-muted-foreground">Use dark theme</span>
          </div>

          <div className={`flex flex-col items-center space-y-2 rounded-md border p-4 ${theme === "system" ? "border-primary" : "border-border"}`}>
            <RadioGroupItem value="system" id="system" className="sr-only" />
            <Laptop className="h-6 w-6" />
            <Label htmlFor="system" className="cursor-pointer">System</Label>
            <span className="text-xs text-muted-foreground">Follow system settings</span>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
