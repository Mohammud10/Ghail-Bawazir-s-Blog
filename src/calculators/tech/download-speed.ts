import { CalculatorConfig, CalculatorResult } from '../types';

export const downloadSpeedCalculator: CalculatorConfig = {
  slug: 'download-speed',
  categorySlug: 'tech',
  translationNamespace: 'calculators.downloadSpeed',
  icon: 'Download',
  inputs: [
    {
      id: 'fileSize',
      type: 'number',
      labelKey: 'fileSize',
      placeholderKey: 'fileSizePlaceholder',
      required: true,
      min: 0.1,
    },
    {
      id: 'speed',
      type: 'number',
      labelKey: 'speed',
      placeholderKey: 'speedPlaceholder',
      required: true,
      min: 0.1,
    },
  ],
  calculate: (inputs: Record<string, number | string>): CalculatorResult => {
    const fileSizeGB = Number(inputs.fileSize); // in GB
    const speedMbps = Number(inputs.speed); // in Mbps

    // Convert GB to Megabits:
    // 1 GB = 1024 MB = 1024 * 8 Megabits = 8192 Megabits
    const fileSizeMegabits = fileSizeGB * 8192;
    const totalSeconds = fileSizeMegabits / speedMbps;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const timeStringAr = `${hours} ساعة، ${minutes} دقيقة، ${seconds} ثانية`;
    const timeStringEn = `${hours}h ${minutes}m ${seconds}s`;

    return {
      items: [
        {
          labelKey: 'downloadTime',
          value: timeStringEn, // Will toggle with translations custom check if needed, but timeStringEn/Ar is readable
          highlight: true,
          type: 'info',
        },
      ],
      disclaimerKey: 'mathDisclaimer',
    };
  },
  relatedSlugs: ['file-size', 'password-strength'],
};
