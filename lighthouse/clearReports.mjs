import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

export async function clearReports(output) {
  await mkdir(output, { recursive: true });
  for (const profile of ['desktop', 'mobile']) {
    for (const page of ['home', 'detail']) {
      const files = [1, 2, 3].flatMap((run) =>
        ['html', 'json', 'report.html', 'report.json'].map((extension) =>
          path.join(output, profile, page, `run-${run}.${extension}`),
        ),
      );
      await Promise.all(files.map((file) => rm(file, { force: true })));
    }
  }
  await rm(path.join(output, 'summary.json'), { force: true });
}
