/**
 * Color scaling utilities for consistent color coding across the RPA app
 * Score colors: 0-2 (Red/Poor), 2-4 (Yellow/Fair), 4-5 (Green/Good)
 * Risk colors: INVERTED - 0-2 (Green/Low), 2-4 (Yellow/Medium), 4-5 (Red/High)
 */

/**
 * Get Tailwind class name for score color (0-5 scale)
 * 0-2 = Red, 2-4 = Yellow, 4-5 = Green
 */
export function getScoreColor(score: number): string {
  if (score <= 2) return 'bg-red-500';
  if (score <= 4) return 'bg-yellow-500';
  return 'bg-green-500';
}

/**
 * Get Tailwind class name for risk color (INVERTED logic)
 * 0-2 = Green (Low Risk), 2-4 = Yellow (Medium Risk), 4-5 = Red (High Risk)
 */
export function getRiskColor(riskLevel: number): string {
  if (riskLevel <= 2) return 'bg-green-500';
  if (riskLevel <= 4) return 'bg-yellow-500';
  return 'bg-red-500';
}

/**
 * Get hex color code for score (0-5 scale)
 * Used for charts and visualizations
 */
export function getScoreColorHex(score: number): string {
  if (score <= 2) return '#EF4444'; // Red
  if (score <= 4) return '#FBBF24'; // Yellow
  return '#22C55E'; // Green
}

/**
 * Get hex color code for risk (INVERTED logic)
 * Used for charts and visualizations
 */
export function getRiskColorHex(riskLevel: number): string {
  if (riskLevel <= 2) return '#22C55E'; // Green (Low Risk)
  if (riskLevel <= 4) return '#FBBF24'; // Yellow (Medium Risk)
  return '#EF4444'; // Red (High Risk)
}

/**
 * Get human-readable label for score
 */
export function getScoreLabel(score: number): string {
  if (score <= 2) return 'Poor';
  if (score <= 4) return 'Fair';
  return 'Good';
}

/**
 * Get text color class for score (useful for text elements)
 */
export function getScoreTextColor(score: number): string {
  if (score <= 2) return 'text-red-500';
  if (score <= 4) return 'text-yellow-500';
  return 'text-green-500';
}

/**
 * Get text color class for risk (INVERTED)
 */
export function getRiskTextColor(riskLevel: number): string {
  if (riskLevel <= 2) return 'text-green-500';
  if (riskLevel <= 4) return 'text-yellow-500';
  return 'text-red-500';
}

/**
 * Get border color class for score
 */
export function getScoreBorderColor(score: number): string {
  if (score <= 2) return 'border-red-500';
  if (score <= 4) return 'border-yellow-500';
  return 'border-green-500';
}

/**
 * Get border color class for risk (INVERTED)
 */
export function getRiskBorderColor(riskLevel: number): string {
  if (riskLevel <= 2) return 'border-green-500';
  if (riskLevel <= 4) return 'border-yellow-500';
  return 'border-red-500';
}

/**
 * Create a colored circle indicator as a simple object
 * Returns Tailwind classes for a small colored circle div
 */
export function getScoreCircleClass(score: number): string {
  return `w-4 h-4 rounded-full ${getScoreColor(score)}`;
}

/**
 * Create a colored circle indicator for risk
 */
export function getRiskCircleClass(riskLevel: number): string {
  return `w-4 h-4 rounded-full ${getRiskColor(riskLevel)}`;
}

/**
 * Convert score to percentage (0-5 -> 0-100)
 */
export function scoreToPercentage(score: number): number {
  return (score / 5) * 100;
}

/**
 * Determine if score is good enough for action
 * Returns true if score > 3
 */
export function isScoreActionable(score: number): boolean {
  return score > 3;
}
