# tangerine
Chrome extension to allow looking at Tangerine bank accounts with useful information; requires special naming convention for accounts to encode RSP GIC or GIC, re-enroll or not, maturity date, current rate. See examples below for more details.

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

Examples:
- RGZ2020210121 150

   RSP GIC with re-enroll every 2.0 years. Matures 2021-Jan-21. Current rate: 1.5%
- RG20190228 155

   RSP GIC without re-enroll. Matures 2019-Feb-28. Current rate: 1.55%

     
No other account types are analyzed.

# mentions
- Orange icon courtesy of: [Flat Icon Repository](http://www.flaticon.com/search?word=orange)
- Jquery
- [DataTables.Net](https://datatables.net)

# how to use
You can get this chrome extension from the chrome store [search: tangerine bank chrome store] or you can download all this source and load an as an unpacked extension in chrome. Goto chrome://extensions to turn on developer mode to load unpacked extension.

Change the name of your accounts to honour the format described above. Whenever you goto accounts page, you will be presented with a more useful accounts page.
