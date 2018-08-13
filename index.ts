import app from './app'
import release from './api/release'
import tracks from './api/tracks'

import { ExploreCriteria, Release } from './crawlers/Base'

app.use('/releases', release)
app.use('/tracks', tracks)
app.listen(3000, () => console.log('Example app listening on port 3000!'))
