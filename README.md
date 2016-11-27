# tangerine
Chrome extension to properly allow looking at Tangerine bank accounts; requires special naming convention for accounts.

RSP GIC accounts must be named as follows:
- RG[ZQQ]YYYYMMDD XXX
- WHERE:
    - [ZQQ] is optional. It indicates an automatic re-enrollment every QQ years. QQ can be: 10 [1.0 year], 15 [1.5 years], 20,...
    - YYYY is the year of maturity
    - MM is the month of maturity; starts at 01 [January]
    - DD is the day of maturity; starts at 01
    - XXX is the rate. 100 is 1.0%. 150 is 1.5%. 200 is 2.0%.
     
GIC is the same as above except it doesn't start with R
- G[ZQQ]YYYYMMDD XXX

     
No other account types are analyzed.
