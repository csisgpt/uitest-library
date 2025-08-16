import { render, fireEvent } from '@testing-library/vue';
import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { BaseSegment, BaseSegmentButton } from '../components/segment';
import segmentStyles from '../components/segment/BaseSegment.module.css';

describe('BaseSegment', () => {
  it('updates value on click', async () => {
    const model = ref<any>(null);
    const { getByRole } = render({
      components: { BaseSegment, BaseSegmentButton },
      setup() { return { model }; },
      template: `
        <BaseSegment v-model="model">
          <BaseSegmentButton value="a" label="A" />
          <BaseSegmentButton value="b" label="B" />
        </BaseSegment>
      `,
    });
    const a = getByRole('radio', { name: 'A' });
    await fireEvent.click(a);
    expect(model.value).toBe('a');
  });

  it('keyboard navigation moves focus', async () => {
    const { getByRole } = render({
      components: { BaseSegment, BaseSegmentButton },
      template: `
        <BaseSegment>
          <BaseSegmentButton value="a" label="A" />
          <BaseSegmentButton value="b" label="B" />
        </BaseSegment>
      `,
    });
    const a = getByRole('radio', { name: 'A' });
    const b = getByRole('radio', { name: 'B' });
    a.focus();
    await fireEvent.keyDown(a, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(b);
  });

  it('multiple mode toggles array', async () => {
    const model = ref<string[]>([]);
    const { getByRole } = render({
      components: { BaseSegment, BaseSegmentButton },
      setup() { return { model }; },
      template: `
        <BaseSegment v-model="model" multiple>
          <BaseSegmentButton value="a" label="A" />
          <BaseSegmentButton value="b" label="B" />
        </BaseSegment>
      `,
    });
    const a = getByRole('button', { name: 'A' });
    await fireEvent.click(a);
    expect(model.value).toContain('a');
  });

  it('applies scrollable class', () => {
    const { container } = render(BaseSegment, { props: { scrollable: true } });
    expect(container.firstChild).toHaveClass(segmentStyles.scrollable);
  });
});
