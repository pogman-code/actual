import React, { useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

import { AlignedText } from '@actual-app/components/aligned-text';
import { theme } from '@actual-app/components/theme';
import { css } from '@emotion/css';
import * as d from 'date-fns';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts';

import {
  amountToCurrency,
  amountToCurrencyNoDecimal,
} from 'loot-core/shared/util';

import { chartTheme } from '@desktop-client/components/reports/chart-theme';
import { Container } from '@desktop-client/components/reports/Container';
import { useLocale } from '@desktop-client/hooks/useLocale';
import { usePrivacyMode } from '@desktop-client/hooks/usePrivacyMode';

const MAX_BAR_SIZE = 50;
const ANIMATION_DURATION = 1000; // in ms

type CustomTooltipProps = TooltipProps<number, 'date'> & {
  isConcise: boolean;
};

function CustomTooltip({ active, payload, isConcise }: CustomTooltipProps) {
  const locale = useLocale();
  const { t } = useTranslation();

  if (!active || !payload || !Array.isArray(payload) || !payload[0]) {
    return null;
  }

  const [{ payload: data }] = payload;

  return (
    <div
      className={css({
        pointerEvents: 'none',
        borderRadius: 2,
        boxShadow: '0 1px 6px rgba(0, 0, 0, .20)',
        backgroundColor: theme.menuBackground,
        color: theme.menuItemText,
        padding: 10,
      })}
    >
      <div>
        <div style={{ marginBottom: 10 }}>
          <strong>
            {d.format(data.date, isConcise ? 'MMMM yyyy' : 'MMMM dd, yyyy', {
              locale,
            })}
          </strong>
        </div>
        <div style={{ lineHeight: 1.5 }}>
          <AlignedText
            left={t('Income:')}
            right={amountToCurrency(data.income)}
          />
          <AlignedText
            left={t('Expenses:')}
            right={amountToCurrency(data.expenses)}
          />
          <AlignedText
            left={t('Change:')}
            right={
              <strong>{amountToCurrency(data.income + data.expenses)}</strong>
            }
          />
          {data.transfers !== 0 && (
            <AlignedText
              left={t('Transfers:')}
              right={amountToCurrency(data.transfers)}
            />
          )}
          <AlignedText
            left={t('Balance:')}
            right={amountToCurrency(data.balance)}
          />
        </div>
      </div>
    </div>
  );
}

type CashFlowGraphProps = {
  graphData: {
    expenses: { x: Date; y: number }[];
    income: { x: Date; y: number }[];
    balances: { x: Date; y: number }[];
    transfers: { x: Date; y: number }[];
  };
  isConcise: boolean;
  showBalance?: boolean;
  style?: CSSProperties;
};
export function CashFlowGraph({
  graphData,
  isConcise,
  showBalance = true,
  style,
}: CashFlowGraphProps) {
  const locale = useLocale();
  const privacyMode = usePrivacyMode();
  const [yAxisIsHovered, setYAxisIsHovered] = useState(false);

  const data = graphData.expenses.map((row, idx) => ({
    date: row.x,
    expenses: row.y,
    income: graphData.income[idx].y,
    balance: graphData.balances[idx].y,
    transfers: graphData.transfers[idx].y,
  }));

  return (
    <Container style={style}>
      {(width, height) => (
        <ResponsiveContainer>
          <ComposedChart
            width={width}
            height={height}
            stackOffset="sign"
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: theme.reportsLabel }}
              tickFormatter={x => {
                // eslint-disable-next-line actual/typography
                return d.format(x, isConcise ? "MMM ''yy" : 'MMM d', {
                  locale,
                });
              }}
              minTickGap={50}
            />
            <YAxis
              tick={{ fill: theme.reportsLabel }}
              tickCount={8}
              tickFormatter={value =>
                privacyMode && !yAxisIsHovered
                  ? '...'
                  : amountToCurrencyNoDecimal(value)
              }
              onMouseEnter={() => setYAxisIsHovered(true)}
              onMouseLeave={() => setYAxisIsHovered(false)}
            />
            <Tooltip
              labelFormatter={x => {
                // eslint-disable-next-line actual/typography
                return d.format(x, isConcise ? "MMM ''yy" : 'MMM d', {
                  locale,
                });
              }}
              content={<CustomTooltip isConcise={isConcise} />}
              isAnimationActive={false}
            />

            <ReferenceLine y={0} stroke="#000" />
            <Bar
              dataKey="income"
              stackId="a"
              fill={chartTheme.colors.blue}
              maxBarSize={MAX_BAR_SIZE}
              animationDuration={ANIMATION_DURATION}
            />
            <Bar
              dataKey="expenses"
              stackId="a"
              fill={chartTheme.colors.red}
              maxBarSize={MAX_BAR_SIZE}
              animationDuration={ANIMATION_DURATION}
            />
            <Line
              type="monotone"
              dataKey="balance"
              dot={false}
              hide={!showBalance}
              stroke={theme.pageTextLight}
              strokeWidth={2}
              animationDuration={ANIMATION_DURATION}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </Container>
  );
}
