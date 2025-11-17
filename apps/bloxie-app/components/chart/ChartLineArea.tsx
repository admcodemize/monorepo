import React from "react";
import { Dimensions, View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { LineChart } from "react-native-gifted-charts";

import { STYLES } from "@codemize/constants/Styles";

import { getCurrencyCode } from "@/helpers/System";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import HorizontalDashedLine from "@/components/container/HorizontalDashedLine";
import TextBase from "@/components/typography/Text";

import GlobalTypographyStyle from "@/styles/GlobalTypography";
import ChartLineAreaStyle from "@/styles/components/chart/ChartLineArea";

const DIM = Dimensions.get("window");

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type ChartLineAreaDataProps = {
  value: number;
  now: Date|undefined;
  dataPointLabel: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type ChartLineAreaProps = {
  data: ChartLineAreaDataProps[];
  height?: number;
  noOfSections?: number;
  isAnimated?: boolean;
  animateOnDataChange?: boolean;
  additionalTopSpacing?: number;
  showReferenceLine1?: boolean;
  showVerticalLines?: boolean;
  pointerStripColor?: string;
  pointerComponentColor?: string;
  startFillColor?: string;
  startOpacity?: number;
  endFillColor?: string;
  endOpacity?: number;
  stepValue?: number;
  showCurrency?: boolean;
  onPointerComponentMove?: (item: ChartLineAreaDataProps) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @param {ChartLineAreaProps} param0
 * @param {number} param0.height - The height of the chart
 * @param {number} param0.noOfSections - The number of sections of the chart
 * @param {boolean} param0.isAnimated
 * @param {boolean} param0.animateOnDataChange - Whether to animate on data change
 * @param {number} param0.additionalTopSpacing - The additional top spacing of the chart for better readability of the chart
 * @param {boolean} param0.showReferenceLine1 - Whether to show the reference line
 * @param {boolean} param0.showVerticalLines - Whether to show the vertical lines
 * @param {string} param0.pointerStripColor - The color of the pointer strip
 * @param {string} param0.pointerComponentColor - The color of the pointer component
 * @param {string} param0.startFillColor - The color of the start fill
 * @param {number} param0.startOpacity - The opacity of the start fill
 * @param {string} param0.endFillColor - The color of the end fill
 * @param {number} param0.endOpacity - The opacity of the end fill
 * @param {number} param0.stepValue - The step value of the chart
 * @param {boolean} param0.showCurrency - Whether to show the currency of the average value
 * @param {Function} param0.onPointerComponentMove - The function to call when the pointer component moves to a new data point
 * @component */
const ChartLineArea = ({
  data,
  height = 60,
  noOfSections = 4,
  isAnimated = true,
  animateOnDataChange = true,
  additionalTopSpacing = 40,
  showReferenceLine1,
  showVerticalLines,
  pointerStripColor,
  pointerComponentColor,
  startFillColor,
  startOpacity = 0.8,
  endFillColor,
  endOpacity = 0.1,
  showCurrency = false,
  onPointerComponentMove
}: ChartLineAreaProps) => {
  const colors = useThemeColors();

  /** @description Calculate the max and min value of the data for displaying the average line with spacer at the top */
  const dataMaxValue = Math.max(...data.map(({ value }) => value)) + additionalTopSpacing;
  const dataMinValue = Math.min(...data.map(({ value }) => value));

  const range = dataMaxValue - dataMinValue;
  const chartMaxValue = Math.ceil(dataMaxValue + (range * 0.1)); 
  
  /** @description Calculate the step value based on the maxValue and noOfSections for better readability of the chart */
  const stepValue = Math.ceil(dataMaxValue ?? 0 / noOfSections);

  /**
   * @description Calculate the manual pixel position of the Average-Line
   * Position from top: 0 = top, height = bottom */
  const averageValue = data.reduce((acc, { value }) => acc + value, 0) / data.length;
  const averageLineY = height * (1 - (averageValue / chartMaxValue));

  /**
   * @description Animated style for the average line view
   * Animates the top position smoothly when data changes */
  const animatedAverageLineStyle = useAnimatedStyle(() => ({
    top: withTiming(averageLineY, {
      duration: 500,
    }),
  }));

  return (
    <View style={[ChartLineAreaStyle.view]}>
      <LineChart
        areaChart
        data={data}
        width={DIM.width - STYLES.paddingHorizontal * 4}
        height={height}
        maxValue={dataMaxValue}
        noOfSections={noOfSections}
        showVerticalLines={showVerticalLines}
        adjustToWidth={true}
        xAxisThickness={0}
        xAxisLabelsHeight={0}
        xAxisIndicesHeight={0}
        xAxisLength={DIM.width}
        showXAxisIndices={false}
        yAxisThickness={0}
        yAxisLabelWidth={0}
        hideYAxisText={true}
        showYAxisIndices={false}
        focusEnabled={false}
        disableScroll={true}
        renderDataPointsAfterAnimationEnds={true}
        color={startFillColor || colors.startFillColor}
        startFillColor={startFillColor || colors.startFillColor}
        startOpacity={startOpacity}
        endFillColor={endFillColor || colors.endFillColor || colors.secondaryBorderColor}
        endOpacity={endOpacity}
        isAnimated={isAnimated}
        animateOnDataChange={animateOnDataChange}
        hideOrigin={false}
        hideDataPoints
        stepValue={stepValue}
        initialSpacing={0} 
        rulesColor={colors.primaryBorderColor}
        showReferenceLine1={false}
        pointerConfig={{
          barTouchable: true,
          pointerStripColor: colors.pointerStripColor,
          pointerStripWidth: 1,
          pointerStripUptoDataPoint: false,
          autoAdjustPointerLabelPosition: false,
          resetPointerOnDataChange: true,
          persistPointer: true,
          pointerEvents: "box-only",
          pointerLabelComponent: (items: ChartLineAreaDataProps[]) => onPointerComponentMove?.(items[0]),
          pointerComponent: () => <View style={[ChartLineAreaStyle.chartPointerView, { 
            backgroundColor: colors.pointerComponentColor || pointerComponentColor 
          }]} />
        }} />
      {showReferenceLine1 && <Animated.View style={[ChartLineAreaStyle.averageLineView, animatedAverageLineStyle]}>
        <HorizontalDashedLine strokeColor={`${colors.focusedBgColor}80`} />
        <View style={[ChartLineAreaStyle.averageLineLabelView, {
          backgroundColor: colors.focusedBgColor
        }]}>
          <TextBase
            text={`⌀ ${averageValue.toFixed(2)} ${showCurrency ? getCurrencyCode() : ""}`}
            style={[GlobalTypographyStyle.headerSubtitle, {
              fontSize: 10,
              color: colors.focusedContentColor,
            }]}
          />
        </View>
      </Animated.View>}
    </View>
  )
}

export default ChartLineArea;