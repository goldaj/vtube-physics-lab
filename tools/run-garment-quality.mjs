/** Offline synthetic demonstration. Writes JSON to stdout only; no file/network/device access. */
import {buildSyntheticGarmentReport} from '../src/garment-benchmark.mjs';
const report=buildSyntheticGarmentReport();
process.stdout.write(JSON.stringify(report,null,2)+'\n');
