export const resumecss=`
    .box{
           height: 100%;
           padding: 20px;
           color: #595B66;
           font-family: 'Microsoft Yahei', sans-serif;
       }
    .toText{
       padding: 10px;
       background:#B0C4DE;
       margin: 0 15px;
       display: flex;
       justify-content: center;
       align-items: center;
       position: relative;
       display: -webkit-box;
       display: -ms-flexbox;
       display: flex;
       -webkit-box-pack: center;
       -ms-flex-pack: center;
       -webkit-box-align: center;
       -ms-flex-align: center;
       word-break:break-all;
       word-wrap:break-word
   }
   .fromText{
       padding: 10px;
       background: #409EFF;
       margin: 0 15px;
       display: -webkit-box;
       display: -ms-flexbox;
       display: flex;
       -webkit-box-pack: center;
       -ms-flex-pack: center;
       justify-content: center;
       -webkit-box-align: center;
       -ms-flex-align: center;
       align-items: center;
       position: relative;
       /*width: 50%;*/
       word-break:break-all;
       word-wrap:break-word
   }
   .toHeader,.fromHeader{
       display:none;
   }
   .toMsgTime,.fromMsgTime{
       margin: 13px 15px;
       display: flex;
   }
   .fromMsgTime{
       flex-direction: row-reverse;
   }
   .to,.from{
       margin: 0 15px;
       display: flex;
       align-items: center;
       font-size: 15px;
   }
   .from{
       flex-direction: row-reverse;
   }
`