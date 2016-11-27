# tangerine
Chrome extension to properly allow looking at Tangerine bank accounts; requires special naming convention for accounts.

RSP GIC accounts must be named as follows:
- RG[ZQQ]YYYYMMDD XX
- WHERE:
    - [ZQQ] is optional. It indicates an automatic re-enrollment every QQ years. QQ can be: 01 [1 year], 15 [1.5 years], 02,...
    - YYYY is the year of maturity
    - MM is the month of maturity; starts at 01 [January]
    - DD is the day of maturity; starts at 01
    - XX is the rate. 10 is 1.0%. 15 is 1.5%. 20 is 2.0%.
     
GIC is the same as above except it doesn't start with R
- G[ZQQ]YYYYMMDD XX

     
No other account types are analyzed.
