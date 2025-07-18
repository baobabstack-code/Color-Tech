import React from "react";
import { getContrastRatio, meetsContrastStandard } from "@/lib/color-utils";

type ContrastDemonstrationProps = {
  /**
   * Array of text/background color combinations to demonstrate
   */
  combinations: Array<{
    foreground: string;
    background: string;
    label?: string;
  }>;
  /**
   * The text to display in the demonstration
   */
  sampleText?: string;
  /**
   * Whether to show the contrast ratio
   */
  showContrastRatio?: boolean;
  /**
   * Whether to show the WCAG level (AAA, AA, AA Large, or Poor)
   */
  showWCAGLevel?: boolean;
  /**
   * Whether to show a pass/fail indicator
   */
  showPassFail?: boolean;
  /**
   * Additional class name for the container
   */
  className?: string;
};

/**
 * Component that demonstrates text contrast by showing sample text with different
 * foreground/background color combinations and their accessibility ratings
 */
export function ContrastDemonstration({
  combinations,
  sampleText = "The quick brown fox jumps over the lazy dog.",
  showContrastRatio = true,
  showWCAGLevel = true,
  showPassFail = true,
  className = "",
}: ContrastDemonstrationProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {combinations.map((combo, index) => {
        const contrastRatio = getContrastRatio(
          combo.foreground,
          combo.background
        );
        const wcagLevel = meetsContrastStandard(contrastRatio, "AA", false); // Assuming normal text
        const passes = contrastRatio >= 4.5; // WCAG AA for normal text

        return (
          <div
            key={index}
            className="border rounded-lg overflow-hidden shadow-sm"
          >
            {combo.label && (
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b">
                <h3 className="font-medium">{combo.label}</h3>
              </div>
            )}

            <div
              className="p-6"
              style={{
                backgroundColor: combo.background,
                color: combo.foreground,
              }}
            >
              <p className="text-base">{sampleText}</p>
              <p className="mt-2 text-sm font-medium">
                {combo.foreground} on {combo.background}
              </p>
            </div>

            <div className="px-4 py-3 bg-white dark:bg-gray-900 flex flex-wrap gap-4 items-center">
              {showContrastRatio && (
                <div>
                  <span className="text-sm font-medium">Contrast Ratio: </span>
                  <span
                    className={`text-sm ${getContrastColor(contrastRatio)}`}
                  >
                    {contrastRatio.toFixed(2)}:1
                  </span>
                </div>
              )}

              {showWCAGLevel && (
                <div>
                  <span className="text-sm font-medium">WCAG Level: </span>
                  <span
                    className={`text-sm ${wcagLevel ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {wcagLevel ? "AA" : "Fails"}
                  </span>
                </div>
              )}

              {showPassFail && (
                <div>
                  <span className="text-sm font-medium">AA Standard: </span>
                  <span
                    className={`text-sm ${passes ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {passes ? "Pass ✓" : "Fail ✗"}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Component that shows text samples with different font sizes and weights
 * to demonstrate how they affect readability
 */
export function TextReadabilityDemonstration({
  background = "#ffffff",
  foreground = "#000000",
  className = "",
}: {
  background?: string;
  foreground?: string;
  className?: string;
}) {
  const textSamples = [
    { size: "text-xs", weight: "font-normal", label: "Extra Small (12px)" },
    { size: "text-sm", weight: "font-normal", label: "Small (14px)" },
    { size: "text-base", weight: "font-normal", label: "Base (16px)" },
    { size: "text-lg", weight: "font-normal", label: "Large (18px)" },
    { size: "text-xl", weight: "font-normal", label: "Extra Large (20px)" },
    { size: "text-base", weight: "font-light", label: "Light Weight" },
    { size: "text-base", weight: "font-normal", label: "Normal Weight" },
    { size: "text-base", weight: "font-medium", label: "Medium Weight" },
    { size: "text-base", weight: "font-semibold", label: "Semibold Weight" },
    { size: "text-base", weight: "font-bold", label: "Bold Weight" },
  ];

  const contrastRatio = getContrastRatio(foreground, background);

  return (
    <div className={`border rounded-lg overflow-hidden shadow-sm ${className}`}>
      <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b">
        <h3 className="font-medium">Text Readability Demonstration</h3>
        <p className="text-sm mt-1">
          Contrast Ratio:{" "}
          <span className={getContrastColor(contrastRatio)}>
            {contrastRatio.toFixed(2)}:1
          </span>
        </p>
      </div>

      <div
        className="p-6 space-y-6"
        style={{ backgroundColor: background, color: foreground }}
      >
        {textSamples.map((sample, index) => (
          <div key={index} className="space-y-1">
            <p className={`${sample.size} ${sample.weight}`}>
              The quick brown fox jumps over the lazy dog.
            </p>
            <p className="text-xs opacity-75">{sample.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Component that demonstrates line height and letter spacing effects on readability
 */
export function TextSpacingDemonstration({
  background = "#ffffff",
  foreground = "#000000",
  className = "",
}: {
  background?: string;
  foreground?: string;
  className?: string;
}) {
  const spacingSamples = [
    {
      lineHeight: "leading-none",
      letterSpacing: "tracking-normal",
      label: "No Line Height (1)",
    },
    {
      lineHeight: "leading-tight",
      letterSpacing: "tracking-normal",
      label: "Tight Line Height (1.25)",
    },
    {
      lineHeight: "leading-normal",
      letterSpacing: "tracking-normal",
      label: "Normal Line Height (1.5)",
    },
    {
      lineHeight: "leading-relaxed",
      letterSpacing: "tracking-normal",
      label: "Relaxed Line Height (1.75)",
    },
    {
      lineHeight: "leading-loose",
      letterSpacing: "tracking-normal",
      label: "Loose Line Height (2)",
    },
    {
      lineHeight: "leading-normal",
      letterSpacing: "tracking-tighter",
      label: "Tighter Letter Spacing (-0.05em)",
    },
    {
      lineHeight: "leading-normal",
      letterSpacing: "tracking-tight",
      label: "Tight Letter Spacing (-0.025em)",
    },
    {
      lineHeight: "leading-normal",
      letterSpacing: "tracking-normal",
      label: "Normal Letter Spacing (0)",
    },
    {
      lineHeight: "leading-normal",
      letterSpacing: "tracking-wide",
      label: "Wide Letter Spacing (0.025em)",
    },
    {
      lineHeight: "leading-normal",
      letterSpacing: "tracking-wider",
      label: "Wider Letter Spacing (0.05em)",
    },
  ];

  return (
    <div className={`border rounded-lg overflow-hidden shadow-sm ${className}`}>
      <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b">
        <h3 className="font-medium">Text Spacing Demonstration</h3>
      </div>

      <div
        className="p-6 space-y-8"
        style={{ backgroundColor: background, color: foreground }}
      >
        {spacingSamples.map((sample, index) => (
          <div key={index} className="space-y-1">
            <p
              className={`text-base ${sample.lineHeight} ${sample.letterSpacing}`}
            >
              The quick brown fox jumps over the lazy dog. The five boxing
              wizards jump quickly. This paragraph demonstrates the effect of
              different line heights and letter spacing on text readability.
            </p>
            <p className="text-xs opacity-75">{sample.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper functions
function getContrastColor(ratio: number): string {
  if (ratio >= 7) return "text-green-600 dark:text-green-400";
  if (ratio >= 4.5) return "text-green-600 dark:text-green-400";
  if (ratio >= 3) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function getWCAGLevelColor(level: string): string {
  switch (level) {
    case "AAA":
      return "text-green-600 dark:text-green-400";
    case "AA":
      return "text-green-600 dark:text-green-400";
    case "AA Large":
      return "text-yellow-600 dark:text-yellow-400";
    default:
      return "text-red-600 dark:text-red-400";
  }
}
