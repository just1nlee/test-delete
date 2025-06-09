import { render, fireEvent, screen } from '@testing-library/svelte';
import ChartBuilder from '../../src/lib/components/chartBuilder.svelte';
import { vi, expect } from 'vitest';
import * as chartApi from '../../src/lib/generateChart';

// fills X (textbox) and Y (number) for a row
function fillPoint(row: number, x: string, y: string) {
  const xs = screen.getAllByRole('spinbutton', { name: /^x$/i });
  const ys = screen.getAllByRole('spinbutton', { name: /^y$/i });
  fireEvent.input(xs[row], { target: { value: x } });
  fireEvent.input(ys[row], { target: { value: y } });
}

// before each test, make a fresh ChartBuilder with type scatter
describe('ChartBuilder (scatter) integration', () => {
  beforeEach(() => {
    render(ChartBuilder, { props: { type: 'scatter' } });
  });

  // start with 1 x/y row
  it('can add value inputs', async () => {
    expect(screen.getAllByRole('spinbutton', { name: /^x$/i })).toHaveLength(1);

    // click + twice
    const addBtn = screen.getByRole('button', { name: '+' });
    await fireEvent.click(addBtn);
    await fireEvent.click(addBtn);

    expect(screen.getAllByRole('spinbutton', { name: /^x$/i })).toHaveLength(3);

    // fill first row
    fillPoint(0, '0', '1');
    await fireEvent.click(addBtn);

    // verify first row values
    expect(screen.getAllByRole('spinbutton', { name: /^x$/i })[0]).toHaveValue(0);
    expect(screen.getAllByRole('spinbutton', { name: /^y$/i })[0]).toHaveValue(1);
  });

  it('shows alerts when required fields are missing', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // click generate chart with an empty form, expect alert
    await fireEvent.click(screen.getByRole('button', { name: /generate chart/i }));
    expect(alertSpy).toHaveBeenCalledTimes(1);

    // fill x and y labels
    await fireEvent.input(screen.getByRole('textbox', { name: /x label/i }), {
      target: { value: 'Time (s)' }
    });
    await fireEvent.input(screen.getByRole('textbox', { name: /y label/i }), {
      target: { value: 'Cookies' }
    });

    // click generate chart again, should alert again
    await fireEvent.click(screen.getByRole('button', { name: /generate chart/i }));
    expect(alertSpy).toHaveBeenCalledTimes(2);

    alertSpy.mockRestore();
  });

  it('clears all chart data', async () => {
    // chart title field
    await fireEvent.input(screen.getByRole('textbox', { name: /chart title/i }), {
      target: { value: 'My Chart' }
    });
    // first X/Y pair
    fillPoint(0, '1', '2');
    await fireEvent.click(screen.getByRole('button', { name: /clear chart data/i }));

    // verify X/Y and title labels fields are cleared
    expect(screen.getByRole('textbox', { name: /chart title/i })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: /x label/i })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: /y label/i })).toHaveValue('');

    expect(screen.getAllByRole('spinbutton', { name: /^x$/i })).toHaveLength(1);
    expect(screen.getByRole('spinbutton', { name: /^x$/i })).toHaveValue(null);
    expect(screen.getByRole('spinbutton', { name: /^y$/i })).toHaveValue(null);
  });

  it('calls generateChart with correct data', async () => {
    // spy on generatechart API, mocking a successful return value
    const genSpy = vi
      .spyOn(chartApi, 'generateChart')
      .mockResolvedValue({ imageData: 'data:image/png;base64,AAA' });

    // fill chart title and X/Y label
    await fireEvent.input(screen.getByRole('textbox', { name: /chart title/i }), {
      target: { value: 'Cookies vs Time' }
    });
    await fireEvent.input(screen.getByRole('textbox', { name: /x label/i }), {
      target: { value: 'Time (s)' }
    });
    await fireEvent.input(screen.getByRole('textbox', { name: /y label/i }), {
      target: { value: 'Cookies' }
    });

    // fill first and second row
    fillPoint(0, '0', '0');
    await fireEvent.click(screen.getByRole('button', { name: '+' }));
    fillPoint(1, '10', '5');
    await fireEvent.click(screen.getByRole('button', { name: /generate chart/i }));

    expect(genSpy).toHaveBeenCalledTimes(1);
    expect(genSpy).toHaveBeenCalledWith(
      'scatter',
      [
        { x: 0, y: 0 },
        { x: 10, y: 5 }
      ],
      'Time (s)',
      'Cookies',
      'Cookies vs Time',
      '#F97316'
    );

    genSpy.mockRestore();
  });
});

