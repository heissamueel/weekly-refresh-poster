const fs=require('fs');
const ok=/\.(jpe?g|png|webp)$/i;
const out=[];
for(const f of fs.readdirSync('.'))if(ok.test(f))out.push(f);
if(fs.existsSync('photos'))for(const f of fs.readdirSync('photos'))if(ok.test(f))out.push('photos/'+f);
fs.writeFileSync('photos.json',JSON.stringify(out));
console.log(out.length+' photos listed');
