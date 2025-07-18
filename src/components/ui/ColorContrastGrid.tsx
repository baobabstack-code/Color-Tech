import React, { useState } from "react";
import { getContrastRatio, meetsContrastStandard } from "@/lib/color-utils";

type ColorContrastGridProps = {
  /**
   * Array of colors to display in the grid
   */
  colors: Array<{
    name: string;
    value: string;
  }>;
  /**
   * Text size to check contrast against ('normal' or 'large')
   */
  textSize?: "normal" | "large";
  /**
   * Additional class name for the container
   */
  className?: string;
};

/**
 * Component that displays a grid showing the contrast ratios between different colors
 * Helps designers and developers choose accessible color combinations
 */
export function ColorContrastGrid({
  colors,
  textSize = "normal",
  className = "",
}: ColorContrastGridProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Function to get the appropriate background color for a cell based on contrast ratio
  const getCellBackgroundColor = (ratio: number, isSelected: boolean) => {
    if (isSelected) return "bg-primary-100 dark:bg-primary-900";

    if (textSize === "normal") {
      if (ratio >= 7) return "bg-green-100 dark:bg-green-900";
      if (ratio >= 4.5) return "bg-green-50 dark:bg-green-800";
      if (ratio >= 3) return "bg-yellow-50 dark:bg-yellow-800";
      return "bg-red-50 dark:bg-red-900";
    } else {
      if (ratio >= 4.5) return "bg-green-100 dark:bg-green-900";
      if (ratio >= 3) return "bg-green-50 dark:bg-green-800";
      return "bg-red-50 dark:bg-red-900";
    }
  };

  // Function to get the appropriate text color for a cell based on contrast ratio
  const getCellTextColor = (ratio: number) => {
    if (textSize === "normal") {
      if (ratio >= 7) return "text-green-700 dark:text-green-300";
      if (ratio >= 4.5) return "text-green-600 dark:text-green-400";
      if (ratio >= 3) return "text-yellow-600 dark:text-yellow-400";
      return "text-red-600 dark:text-red-400";
    } else {
      if (ratio >= 4.5) return "text-green-700 dark:text-green-300";
      if (ratio >= 3) return "text-green-600 dark:text-green-400";
      return "text-red-600 dark:text-red-400";
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Color Contrast Grid</h3>
        <div className="text-sm">
          <span className="font-medium">Text Size: </span>
          <select
            value={textSize}
            onChange={(e) => (textSize = e.target.value as "normal" | "large")}
            className="ml-2 border rounded px-2 py-1"
            aria-label="Select text size for contrast checking"
          >
            <option value="normal">Normal Text (4.5:1)</option>
            <option value="large">Large Text (3:1)</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table
          className="min-w-full border-collapse"
          aria-label="Color contrast grid showing ratios between colors"
        >
          <caption className="sr-only">
            Color contrast grid showing contrast ratios between foreground
            (rows) and background (columns) colors.
            {textSize === "normal"
              ? "Normal text requires 4.5:1 contrast ratio."
              : "Large text requires 3:1 contrast ratio."}
          </caption>

          <thead>
            <tr>
              <th scope="col" className="p-2 border text-left font-medium">
                Foreground / Background
              </th>
              {colors.map((color) => (
                <th
                  key={color.value}
                  scope="col"
                  className="p-2 border text-center font-medium"
                  style={{
                    backgroundColor: color.value,
                    color:
                      getContrastRatio(color.value, "#ffffff") >
                      getContrastRatio(color.value, "#000000")
                        ? "#ffffff"
                        : "#000000",
                  }}
                >
                  <div>{color.name}</div>
                  <div className="text-xs">{color.value}</div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {colors.map((rowColor) => (
              <tr key={rowColor.value}>
                <th
                  scope="row"
                  className="p-2 border text-left font-medium"
                  style={{
                    backgroundColor: rowColor.value,
                    color:
                      getContrastRatio(rowColor.value, "#ffffff") >
                      getContrastRatio(rowColor.value, "#000000")
                        ? "#ffffff"
                        : "#000000",
                  }}
                >
                  <div>{rowColor.name}</div>
                  <div className="text-xs">{rowColor.value}</div>
                </th>

                {colors.map((colColor) => {
                  const contrastRatio = getContrastRatio(
                    rowColor.value,
                    colColor.value
                  );
                  const wcagLevel = meetsContrastStandard(
                    contrastRatio,
                    "AA",
                    textSize === "large"
                  );
                  const isSelected =
                    selectedColor === `${rowColor.value}-${colColor.value}`;

                  return (
                    <td
                      key={colColor.value}
                      className={`p-2 border text-center ${getCellBackgroundColor(contrastRatio, isSelected)} cursor-pointer transition-colors duration-150`}
                      onClick={() =>
                        setSelectedColor(
                          isSelected
                            ? null
                            : `${rowColor.value}-${colColor.value}`
                        )
                      }
                      aria-selected={isSelected}
                    >
                      <div
                        className={`font-medium ${getCellTextColor(contrastRatio)}`}
                      >
                        {contrastRatio.toFixed(2)}
                      </div>
                      <div className="text-xs">{wcagLevel}</div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedColor && (
        <div className="mt-6">
          <h4 className="text-md font-medium mb-2">
            Selected Color Combination
          </h4>
          <ColorCombinationPreview
            foreground={selectedColor.split("-")[0]}
            background={selectedColor.split("-")[1]}
            textSize={textSize}
          />
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded">
          <div className="font-medium text-green-700 dark:text-green-300">
            {textSize === "normal" ? "AAA (7:1+)" : "AAA (4.5:1+)"}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">
            Excellent contrast
          </div>
        </div>

        <div className="p-3 bg-green-50 dark:bg-green-800 border border-green-200 dark:border-green-700 rounded">
          <div className="font-medium text-green-700 dark:text-green-300">
            {textSize === "normal" ? "AA (4.5:1+)" : "AA (3:1+)"}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">
            Good contrast
          </div>
        </div>

        <div className="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded">
          <div className="font-medium text-red-700 dark:text-red-300">
            Fails
          </div>
          <div className="text-sm text-red-600 dark:text-red-400">
            Insufficient contrast
          </div>
        </div>
      </div>
    </div>
  );
}

type ColorCombinationPreviewProps = {
  foreground: string;
  background: string;
  textSize: "normal" | "large";
};

/**
 * Component that displays a preview of a color combination
 */
function ColorCombinationPreview({
  foreground,
  background,
  textSize,
}: ColorCombinationPreviewProps) {
  const contrastRatio = getContrastRatio(foreground, background);
  const wcagLevel = meetsContrastStandard(
    contrastRatio,
    "AA",
    textSize === "large"
  );

  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        className="p-6"
        style={{ backgroundColor: background, color: foreground }}
      >
        <h3 className="text-xl font-semibold mb-2">Sample Text</h3>
        <p className="mb-4">
          This is an example of {foreground} text on a {background} background.
          The contrast ratio is {contrastRatio.toFixed(2)}:1, which{" "}
          {wcagLevel ? "meets" : "does not meet"} WCAG AA standards.
        </p>
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 rounded border-2"
            style={{ borderColor: foreground }}
          >
            Sample Button
          </button>
          <a
            href="#"
            className="px-4 py-2 underline"
            onClick={(e) => e.preventDefault()}
          >
            Sample Link
          </a>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium">Foreground Color</div>
            <div className="flex items-center mt-1">
              <div
                className="w-6 h-6 rounded border mr-2"
                style={{ backgroundColor: foreground }}
                aria-hidden="true"
              ></div>
              <span>{foreground}</span>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium">Background Color</div>
            <div className="flex items-center mt-1">
              <div
                className="w-6 h-6 rounded border mr-2"
                style={{ backgroundColor: background }}
                aria-hidden="true"
              ></div>
              <span>{background}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm font-medium">Contrast Ratio</div>
          <div className="flex items-center mt-1">
            <span
              className={`font-medium ${contrastRatio >= (textSize === "normal" ? 4.5 : 3) ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {contrastRatio.toFixed(2)}:1
            </span>
            <span className="mx-2">•</span>
            <span
              className={`${wcagLevel ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {wcagLevel ? "WCAG AA" : "Fails WCAG"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
