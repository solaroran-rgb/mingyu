import { zodiac, taiyi, wuyunLiuqi, huangjiJingshi } from '@temposoul/core';
for (const [name, obj] of Object.entries({ zodiac, taiyi, wuyunLiuqi, huangjiJingshi })) {
  console.log(name, '->', Object.keys(obj).map((k) => k + ':' + typeof obj[k]).join(', '));
}
