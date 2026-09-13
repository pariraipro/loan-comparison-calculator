import assert from 'node:assert/strict';
import {calculateLoan,rankOffers,defaultOffers,principalValue} from '../dist/calculator.mjs';
const base={rate:12,months:12,fee:0,feeType:'rupees',other:0};
const close=(actual,expected,epsilon=1e-6)=>assert.ok(Math.abs(actual-expected)<epsilon,`${actual} != ${expected}`);
let a=calculateLoan(100000,base);close(a.emi,8884.878867834);close(a.total,106618.546414,0.00001);close(a.interest,6618.546414,0.00001);
let b=calculateLoan(100000,{...base,fee:2000});close(b.emi,a.emi);close(b.total,108618.546414,0.00001);close(b.cost,a.cost+2000);
let zero=calculateLoan(120000,{...base,rate:0,fee:2400});assert.equal(zero.emi,10000);assert.equal(zero.interest,0);assert.equal(zero.total,122400);
let one=calculateLoan(100000,{...base,months:1});close(one.emi,101000);
let percent=calculateLoan(100000,{...base,fee:2,feeType:'percent',other:360});close(percent.upfrontFees,2360);close(percent.total,a.total+2360);
let tiny=calculateLoan(100000,{...base,rate:0.000000001});assert.ok(Number.isFinite(tiny.emi));close(tiny.emi,100000/12,0.00001);
let long=calculateLoan(100000,{...base,months:480});assert.ok(long.emi<a.emi);assert.ok(long.total>a.total);
for(const patch of [{rate:''},{rate:-1},{rate:61},{rate:Infinity},{months:0},{months:2.5},{months:481},{fee:-1},{other:-10},{feeType:'bad'}])assert.throws(()=>calculateLoan(100000,{...base,...patch}));
for(const p of ['',0,NaN,Infinity,9999,100000001])assert.throws(()=>principalValue(p));
const defaults=defaultOffers().map(o=>calculateLoan(1000000,o));const ranks=rankOffers(defaults);assert.deepEqual(ranks.cheapest,[1]);assert.deepEqual(ranks.lowestEmi,[2]);assert.ok(ranks.savings>0);assert.deepEqual(rankOffers([a,a]).cheapest,[0,1]);assert.equal(rankOffers([a,null]),null);
for(const r of [a,b,zero,one,percent,long,...defaults]){close(r.principal+r.cost,r.total,0.00001);close(r.emi*r.months+r.upfrontFees,r.total,0.00001)}
console.log('PASS: independent EMI references, zero interest, 1-month loans, percentage and flat fees, near-zero rates, long tenure, invalid inputs, total invariants, rankings and ties.');
console.log(JSON.stringify(defaults.map(r=>({emi:r.emi,total:r.total,cost:r.cost}))));

