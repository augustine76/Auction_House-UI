import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

console.log(timeAgo.format(new Date("2022-07-01T09:47:33.345+00:00")));