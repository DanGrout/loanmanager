import { AlertTriangle, CheckCircle, AlertCircle, ShieldAlert } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { RiskLevel } from "@/lib/data"

interface RiskIndicatorProps {
  score: number
  level: RiskLevel
}

export default function RiskIndicator({ score, level }: RiskIndicatorProps) {
  // Determine color based on risk level
  const getColorClass = () => {
    switch (level) {
      case "low":
        return "text-green-600 dark:text-green-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "high":
        return "text-orange-600 dark:text-orange-400"
      case "very-high":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  // Determine progress bar color
  const getProgressColor = () => {
    switch (level) {
      case "low":
        return "bg-green-600 dark:bg-green-400"
      case "medium":
        return "bg-yellow-600 dark:bg-yellow-400"
      case "high":
        return "bg-orange-600 dark:bg-orange-400"
      case "very-high":
        return "bg-red-600 dark:bg-red-400"
      default:
        return ""
    }
  }

  // Get icon based on risk level
  const RiskIcon = () => {
    switch (level) {
      case "low":
        return <CheckCircle className="h-5 w-5" />
      case "medium":
        return <AlertCircle className="h-5 w-5" />
      case "high":
        return <AlertTriangle className="h-5 w-5" />
      case "very-high":
        return <ShieldAlert className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={getColorClass()}>
            <RiskIcon />
          </span>
          <span className="font-medium">{level.charAt(0).toUpperCase() + level.slice(1).replace("-", " ")} Risk</span>
        </div>
        <span className={`text-lg font-bold ${getColorClass()}`}>{score}/100</span>
      </div>

      <Progress value={score} className="h-2" indicatorClassName={getProgressColor()} />

      <p className="text-sm text-muted-foreground">
        {level === "low" && "This loan has a low risk profile with strong indicators for repayment."}
        {level === "medium" && "This loan has a moderate risk profile with acceptable repayment indicators."}
        {level === "high" && "This loan has elevated risk factors that may affect repayment."}
        {level === "very-high" && "This loan has significant risk factors that require close monitoring."}
      </p>
    </div>
  )
}
