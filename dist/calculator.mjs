export const LIMITS={minPrincipal:10000,maxPrincipal:100000000,maxMonths:480,maxRate:60,maxFee:100000000};
function numeric(value,label){if(value==null||typeof value==='boolean'||String(value).trim()==='')throw new Error(`Enter ${label}.`);const n=Number(value);if(!Number.isFinite(n))throw new Error(`Enter a valid ${label}.`);return n}
export function principalValue(value){const p=numeric(value,'a loan amount');if(p<LIMITS.minPrincipal||p>LIMITS.maxPrincipal)throw new Error('Enter a loan amount between ₹10,000 and ₹10 crore.');if(Math.abs(p*100-Math.round(p*100))>0.0001)throw new Error('Use no more than two decimal places for the loan amount.');return p}
export function calculateLoan(principal,offer){
 const p=principalValue(principal),annualRate=numeric(offer.rate,'an interest rate'),months=numeric(offer.months,'a tenure in months'),fee=numeric(offer.fee,'a processing fee (use 0 if none)'),other=numeric(offer.other,'other charges (use 0 if none)');
 if(annualRate<0||annualRate>LIMITS.maxRate)throw new Error('The annual interest rate must be between 0% and 60%.');
 if(!Number.isInteger(months)||months<1||months>LIMITS.maxMonths)throw new Error('Tenure must be a whole number from 1 to 480 months.');
 if(!['rupees','percent'].includes(offer.feeType))throw new Error('Choose a processing fee in rupees or percent.');
 if(fee<0||fee>(offer.feeType==='percent'?100:LIMITS.maxFee))throw new Error(offer.feeType==='percent'?'The processing fee must be between 0% and 100%.':'The processing fee must be between ₹0 and ₹10 crore.');
 if(other<0||other>LIMITS.maxFee)throw new Error('Other charges must be between ₹0 and ₹10 crore.');
 const r=annualRate/1200;
 const emi=r===0?p/months:p*r/-Math.expm1(-months*Math.log1p(r));
 const processingFee=offer.feeType==='percent'?p*fee/100:fee;
 const upfrontFees=processingFee+other;
 const installments=emi*months;
 const interest=Math.max(0,installments-p);
 return {principal:p,annualRate,months,emi,interest,processingFee,other,upfrontFees,installments,total:installments+upfrontFees,cost:interest+upfrontFees};
}
export function rankOffers(results){
 if(!Array.isArray(results)||results.length<2||results.some(r=>!r||!Number.isFinite(r.total)||!Number.isFinite(r.emi)))return null;
 const minTotal=Math.min(...results.map(r=>Math.round(r.total))),minEmi=Math.min(...results.map(r=>Math.round(r.emi)));
 const cheapest=results.map((r,i)=>Math.round(r.total)===minTotal?i:-1).filter(i=>i>=0);
 const lowestEmi=results.map((r,i)=>Math.round(r.emi)===minEmi?i:-1).filter(i=>i>=0);
 const totals=results.map(r=>Math.round(r.total)).sort((a,b)=>a-b);
 return {cheapest,lowestEmi,minTotal,minEmi,savings:totals[1]-totals[0]};
}
export function defaultOffers(){return [{id:'A',name:'Offer A',rate:'11.5',months:'36',fee:'1500',feeType:'rupees',other:'0'},{id:'B',name:'Offer B',rate:'10.5',months:'36',fee:'5000',feeType:'rupees',other:'0'},{id:'C',name:'Offer C',rate:'9.9',months:'36',fee:'19000',feeType:'rupees',other:'0'}]}
