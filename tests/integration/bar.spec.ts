import { render, fireEvent, screen } from '@testing-library/svelte';
import ChartBuilder from '../../src/lib/components/chartBuilder.svelte';
import { vi, expect } from 'vitest';
import * as chartApi from '../../src/lib/generateChart';

// fill 1 bar row
function fillPoint(row: number, x: string, y: string) {
  const xs = screen.getAllByRole('textbox', { name: /^x$/i });
  const ys = screen.getAllByRole('spinbutton', { name: /^y$/i });
  fireEvent.input(xs[row], { target: { value: x } });
  fireEvent.input(ys[row], { target: { value: y } });
}

describe('ChartBuilder (bar) integration', () => {
  beforeEach(() => {
    render(ChartBuilder, { props: { type: 'bar' } });
  });

  it('can add value inputs', async () => {
    expect(screen.getAllByRole('textbox', { name: /^x$/i })).toHaveLength(1);

    const addBtn = screen.getByRole('button', { name: '+' });
    await fireEvent.click(addBtn);
    await fireEvent.click(addBtn);

    expect(screen.getAllByRole('textbox', { name: /^x$/i })).toHaveLength(3);

    // verify the first row
    fillPoint(0, '0', '1');
    await fireEvent.click(addBtn);

    expect(screen.getAllByRole('textbox', { name: /^x$/i })[0]).toHaveValue('0');
    expect(screen.getAllByRole('spinbutton', { name: /^y$/i })[0]).toHaveValue(1);
  });

  it('shows alerts when required fields are missing', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await fireEvent.click(screen.getByRole('button', { name: /generate chart/i }));
    expect(alertSpy).toHaveBeenCalledTimes(1);

    // give labels only
    await fireEvent.input(screen.getByRole('textbox', { name: /x label/i }), {
      target: { value: 'Time (s)' }
    });
    await fireEvent.input(screen.getByRole('textbox', { name: /y label/i }), {
      target: { value: 'Cookies' }
    });

    await fireEvent.click(screen.getByRole('button', { name: /generate chart/i }));

    expect(alertSpy).toHaveBeenCalledTimes(2);
    alertSpy.mockRestore();
  });

  it('clears all chart data', async () => {
    await fireEvent.input(screen.getByRole('textbox', { name: /chart title/i }), {
      target: { value: 'My Chart' }
    });

    fillPoint(0, '1', '2');
    await fireEvent.click(screen.getByRole('button', { name: /clear chart data/i }));

    // make everything blank again
    expect(screen.getByRole('textbox', { name: /chart title/i })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: /x label/i })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: /y label/i })).toHaveValue('');

    expect(screen.getAllByRole('textbox', { name: /^x$/i })).toHaveLength(1);
    expect(screen.getByRole('textbox', { name: /^x$/i })).toHaveValue('');
    expect(screen.getByRole('spinbutton', { name: /^y$/i })).toHaveValue(null);
  });

  it('calls generateChart with correct data', async () => {
    const genSpy = vi
      .spyOn(chartApi, 'generateChart')
      .mockResolvedValue({ imageData: 'data:image/png;base64,AAA' });

    // fill form
    await fireEvent.input(screen.getByRole('textbox', { name: /chart title/i }), {
      target: { value: 'Cookies vs Time' }
    });
    await fireEvent.input(screen.getByRole('textbox', { name: /x label/i }), {
      target: { value: 'Time (s)' }
    });
    await fireEvent.input(screen.getByRole('textbox', { name: /y label/i }), {
      target: { value: 'Cookies' }
    });

    fillPoint(0, '0', '0');
    await fireEvent.click(screen.getByRole('button', { name: '+' }));
    fillPoint(1, '10', '5');
    await fireEvent.click(screen.getByRole('button', { name: /generate chart/i }));

    // payload verification
    expect(genSpy).toHaveBeenCalledTimes(1);
    expect(genSpy).toHaveBeenCalledWith(
      'bar',
      [
        { x: '0', y: 0 },
        { x: '10', y: 5 }
      ],
      'Time (s)',
      'Cookies',
      'Cookies vs Time',
      '#F97316'
    );

    genSpy.mockRestore();
  });
});
