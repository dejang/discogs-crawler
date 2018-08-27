import { init } from '@rematch/core'
import * as models from './models/index'
const store = init({
    models
});

export default store