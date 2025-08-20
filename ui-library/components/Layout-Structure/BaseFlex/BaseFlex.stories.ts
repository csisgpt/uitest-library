import type { Meta, StoryObj } from '@storybook/vue3';
import { h, defineComponent, PropType } from 'vue';
import BaseFlex, { type BaseFlexProps } from './BaseFlex.vue';

/**
 * Helper visual item to make layouts obvious in stories
 */
const ItemBox = defineComponent({
  name: 'ItemBox',
  props: {
    label: { type: String, required: false, default: '' },
    minW: { type: String, required: false, default: '3rem' },
    minH: { type: String, required: false, default: '3rem' },
  },
  setup(props) {
    const style: Partial<CSSStyleDeclaration> = {
      minWidth: props.minW,
      minHeight: props.minH,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background:
        'repeating-linear-gradient(45deg, rgba(0,0,0,.06), rgba(0,0,0,.06) 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px)',
      border: '1px solid var(--border-color, rgba(0,0,0,.15))',
      borderRadius: 'var(--radius-2, 8px)',
      padding: 'var(--spacing-2, 8px)',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, sans-serif',
      fontSize: '12px',
      color: 'var(--text-muted, #555)',
    };
    return () => h('div', { style }, props.label || 'Item');
  },
});

/**
 * Utility to generate N ItemBox children
 */
const makeChildren = (n: number, size?: { minW?: string; minH?: string }) =>
  Array.from({ length: n }, (_, i) =>
    h(ItemBox, { label: String(i + 1), minW: size?.minW, minH: size?.minH })
  );

/**
 * Story render function factory
 */
const renderFactory = (extra?: Partial<BaseFlexProps> & { items?: number }) =>
  (args: BaseFlexProps & { items?: number }) =>
    h(
      BaseFlex as any,
      { ...args, ...extra },
      { default: () => makeChildren(args.items ?? extra?.items ?? 6) }
    );

const DIRECTIONS = ['row', 'column', 'row-reverse', 'column-reverse'] as const;
const WRAPS = ['nowrap', 'wrap', 'wrap-reverse'] as const;
const ALIGNS = ['start', 'center', 'end', 'baseline', 'stretch'] as const;
const JUSTIFIES = ['start', 'center', 'end', 'between', 'around', 'evenly'] as const;
const GAPS = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
const BASIS = ['auto', 'full', '1/2', '1/3', '2/3', '1/4', '3/4'] as const;

/**
 * Default export (component metadata)
 */
const meta: Meta<BaseFlexProps & { items: number }> = {
  title: 'Layout/BaseFlex',
  component: BaseFlex as any,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      description: {
        component:
          'A low-level flexbox container with ergonomic props for direction, alignment, wrapping and spacing. Use it to compose complex layouts with consistent spacing tokens.\n\n**Note:** Spacing presets rely on your design tokens (e.g. `--spacing-*`). Ensure your global CSS variables are loaded in Storybook (via `preview.ts`).',
      },
    },
  },
  argTypes: {
    direction: { control: 'select', options: DIRECTIONS },
    wrap: { control: 'select', options: WRAPS },
    align: { control: 'select', options: ALIGNS },
    justify: { control: 'select', options: JUSTIFIES },
    gap: { control: 'select', options: GAPS },
    rowGap: { control: 'select', options: GAPS },
    columnGap: { control: 'select', options: GAPS },
    grow: { control: 'boolean' },
    shrink: { control: 'boolean' },
    basis: { control: 'select', options: BASIS },
    inline: { control: 'boolean' },
    as: { control: 'text' },
    customGap: { control: 'text' },
    responsive: {
      control: 'object',
      description: 'Record of breakpoint => value custom properties. Your CSS must consume these vars to have a visual effect.',
    },
    items: { control: { type: 'number', min: 1, max: 24, step: 1 } },
  },
  args: {
    direction: 'row',
    wrap: 'nowrap',
    align: 'stretch',
    justify: 'start',
    gap: 'md',
    grow: false,
    shrink: true,
    basis: 'auto',
    inline: false,
    as: 'div',
    items: 6,
  },
  decorators: [
    (story) =>
      h(
        'div',
        {
          style: {
            padding: 'var(--spacing-6, 24px)',
            background:
              'linear-gradient(0deg, rgba(0,0,0,.03) 0 49%, rgba(0,0,0,0) 49%), linear-gradient(90deg, rgba(0,0,0,.03) 0 49%, rgba(0,0,0,0) 49%)',
            backgroundSize: '20px 20px, 20px 20px',
            borderRadius: 'var(--radius-3, 12px)',
          },
        },
        [h('div', { style: { maxWidth: '1100px', margin: '0 auto' } }, [h(story())])]
      ),
  ],
};

export default meta;

// ------------------------------------------------------------
// Playground (fully controlled)
// ------------------------------------------------------------
export const Playground: StoryObj<typeof meta> = {
  name: 'Playground',
  render: renderFactory(),
};

// ------------------------------------------------------------
// Directions
// ------------------------------------------------------------
export const Row: StoryObj<typeof meta> = {
  args: { direction: 'row', items: 5 },
  render: renderFactory(),
};

export const Column: StoryObj<typeof meta> = {
  args: { direction: 'column', items: 5 },
  render: renderFactory({ items: 5 }),
};

export const RowReverse: StoryObj<typeof meta> = {
  args: { direction: 'row-reverse', items: 5 },
  render: renderFactory({ items: 5 }),
};

export const ColumnReverse: StoryObj<typeof meta> = {
  args: { direction: 'column-reverse', items: 5 },
  render: renderFactory({ items: 5 }),
};

// ------------------------------------------------------------
// Wrap
// ------------------------------------------------------------
export const NoWrap: StoryObj<typeof meta> = {
  args: { wrap: 'nowrap', items: 8 },
  render: renderFactory({ items: 8 }),
};

export const Wrap: StoryObj<typeof meta> = {
  args: { wrap: 'wrap', items: 12, gap: 'lg' },
  render: renderFactory({ items: 12 }),
};

export const WrapReverse: StoryObj<typeof meta> = {
  args: { wrap: 'wrap-reverse', items: 12, gap: 'lg' },
  render: renderFactory({ items: 12 }),
};

// ------------------------------------------------------------
// Alignment & Justify
// ------------------------------------------------------------
export const AlignCenter: StoryObj<typeof meta> = {
  args: { align: 'center', items: 4, minH: '5rem' } as any,
  render: (args: any) =>
    h(BaseFlex as any, args, {
      default: () => makeChildren(args.items, { minH: '5rem' }),
    }),
};

export const AlignBaseline: StoryObj<typeof meta> = {
  args: { align: 'baseline', items: 4 } as any,
  render: (args: any) =>
    h(BaseFlex as any, args, {
      default: () => [
        h(ItemBox, { label: 'A', minH: '2rem' }),
        h(ItemBox, { label: 'Bb', minH: '3rem' }),
        h(ItemBox, { label: 'CCC', minH: '4rem' }),
        h(ItemBox, { label: 'DDDD', minH: '2.5rem' }),
      ],
    }),
};

export const JustifyBetween: StoryObj<typeof meta> = {
  args: { justify: 'between', items: 3 },
  render: renderFactory({ items: 3 }),
};

export const CenterCenter: StoryObj<typeof meta> = {
  name: 'Align Center + Justify Center',
  args: { align: 'center', justify: 'center', items: 4, minH: '6rem' } as any,
  render: (args: any) =>
    h(BaseFlex as any, args, {
      default: () => makeChildren(args.items, { minH: '6rem' }),
    }),
};

// ------------------------------------------------------------
// Spacing (gap, rowGap, columnGap)
// ------------------------------------------------------------
export const GapPresets: StoryObj<typeof meta> = {
  name: 'Gap presets',
  render: () =>
    h('div', { style: { display: 'grid', gap: '16px' } }, [
      ...(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const).map((g) =>
        h('div', [
          h('div', { style: { fontSize: '12px', marginBottom: '6px', opacity: .75 } }, `gap: ${g}`),
          h(BaseFlex as any, { gap: g }, { default: () => makeChildren(5) }),
        ])
      ),
    ]),
};

export const RowAndColumnGap: StoryObj<typeof meta> = {
  args: { rowGap: 'lg', columnGap: 'xs', wrap: 'wrap', items: 10 },
  render: renderFactory({ items: 10 }),
};

export const CustomGap: StoryObj<typeof meta> = {
  args: { customGap: 'clamp(6px, 1.2vw, 18px)', items: 8, wrap: 'wrap' },
  render: renderFactory({ items: 8 }),
  parameters: {
    docs: {
      description: {
        story:
          'Pass any CSS length to `customGap` (e.g. `8px`, `1rem`, `clamp()`). The component sets `--flex-gap-custom`; the CSS module applies it via `gap: var(--flex-gap-custom)`.',
      },
    },
  },
};

// ------------------------------------------------------------
// Grow / Shrink / Basis
// ------------------------------------------------------------
export const GrowItems: StoryObj<typeof meta> = {
  name: 'Children growing to fill',
  args: { items: 4, gap: 'sm', justify: 'between' },
  render: () =>
    h(BaseFlex as any, { gap: 'sm' }, {
      default: () => [
        h('div', { style: { flex: '1 1 0', padding: '8px', border: '1px dashed #bbb', borderRadius: '8px' } }, '1 (flex:1 1 0)'),
        h('div', { style: { flex: '2 1 0', padding: '8px', border: '1px dashed #bbb', borderRadius: '8px' } }, '2 (flex:2 1 0)'),
        h('div', { style: { flex: '1 0 200px', padding: '8px', border: '1px dashed #bbb', borderRadius: '8px' } }, '3 (flex:1 0 200px)'),
      ],
    }),
};

export const NoShrink: StoryObj<typeof meta> = {
  args: { shrink: false, wrap: 'wrap', items: 8 },
  render: renderFactory({ items: 8 }),
  parameters: {
    docs: { description: { story: '`shrink=false` sets `flex-shrink: 0` on the container.' } },
  },
};

export const BasisPresets: StoryObj<typeof meta> = {
  render: () =>
    h('div', { style: { display: 'grid', gap: '16px' } }, [
      ...(['full', '1/2', '1/3', '2/3', '1/4', '3/4'] as const).map((b) =>
        h('div', [
          h('div', { style: { fontSize: '12px', marginBottom: '6px', opacity: .75 } }, `basis: ${b}`),
          h(BaseFlex as any, { basis: b, wrap: 'wrap', gap: 'sm' }, { default: () => makeChildren(6) }),
        ])
      ),
    ]),
};

export const CustomBasis: StoryObj<typeof meta> = {
  args: { basis: '280px', wrap: 'wrap', gap: 'sm', items: 8 },
  render: renderFactory({ items: 8 }),
  parameters: {
    docs: { description: { story: 'When `basis` is not a preset, a custom property is set and used in CSS (`--flex-basis-custom`).' } },
  },
};

// ------------------------------------------------------------
// Inline & semantic tags
// ------------------------------------------------------------
export const Inline: StoryObj<typeof meta> = {
  args: { inline: true, gap: 'sm', items: 4 },
  render: renderFactory({ items: 4 }),
};

export const AsList: StoryObj<typeof meta> = {
  name: 'Render as <ul> with <li> children',
  render: (args) =>
    h(BaseFlex as any, { ...args, as: 'ul', gap: 'xs', wrap: 'wrap' }, {
      default: () => Array.from({ length: 6 }, (_, i) => h('li', [h(ItemBox, { label: `Item ${i + 1}` })])),
    }),
};

// ------------------------------------------------------------
// Real-world layouts
// ------------------------------------------------------------
export const Toolbar: StoryObj<typeof meta> = {
  name: 'Toolbar layout',
  render: () =>
    h('div', { style: { border: '1px solid #ddd', borderRadius: '12px' } }, [
      h(BaseFlex as any, { align: 'center', justify: 'between', gap: 'sm', as: 'header', style: 'padding: 12px' }, {
        default: () => [
          h(BaseFlex as any, { align: 'center', gap: 'sm' }, { default: () => [
            h(ItemBox, { label: 'Logo', minW: '4rem', minH: '2rem' }),
            h('div', { style: { fontWeight: '600' } }, 'Project'),
          ] }),
          h(BaseFlex as any, { align: 'center', gap: 'xs' }, { default: () => [
            h(ItemBox, { label: 'Search', minW: '8rem', minH: '2rem' }),
            h(ItemBox, { label: 'Btn' , minW: '3rem', minH: '2rem' }),
            h(ItemBox, { label: 'Avatar', minW: '2rem', minH: '2rem' }),
          ] }),
        ],
      }),
    ]),
};

export const CardGrid: StoryObj<typeof meta> = {
  name: 'Card grid (wrapping with basis)',
  render: () =>
    h(BaseFlex as any, { wrap: 'wrap', gap: 'lg', basis: '280px' }, {
      default: () => makeChildren(12, { minH: '6rem' }),
    }),
};

export const Nested: StoryObj<typeof meta> = {
  render: () =>
    h(BaseFlex as any, { direction: 'column', gap: 'lg' }, {
      default: () => [
        h('div', { style: { fontSize: '12px', opacity: .7 } }, 'Nested flex rows with independent alignment and spacing'),
        h(BaseFlex as any, { align: 'center', justify: 'between', gap: 'sm' }, { default: () => makeChildren(3, { minH: '3rem' }) }),
        h(BaseFlex as any, { wrap: 'wrap', gap: 'sm' }, { default: () => makeChildren(10, { minH: '3rem' }) }),
      ],
    }),
};

// ------------------------------------------------------------
// Responsive notes/demo
// ------------------------------------------------------------
export const ResponsiveGapDemo: StoryObj<typeof meta> = {
  name: 'Responsive gap via CSS media queries',
  render: () =>
    h('div', [
      h('p', { style: { fontSize: '12px', opacity: .75, marginBottom: '8px' } }, 'Resize the canvas: the CSS module increases gap on larger breakpoints.'),
      h(BaseFlex as any, { gap: 'lg', wrap: 'wrap' }, { default: () => makeChildren(10) }),
    ]),
};

// ------------------------------------------------------------
// Edge cases
// ------------------------------------------------------------
export const EmptyState: StoryObj<typeof meta> = {
  render: () => h(BaseFlex as any, { gap: 'md' }),
};

export const SingleChild: StoryObj<typeof meta> = {
  render: () => h(BaseFlex as any, { gap: 'md' }, { default: () => h(ItemBox, { label: 'Only child', minW: '8rem' }) }),
};
