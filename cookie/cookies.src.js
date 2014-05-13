//Usage
var cookieObj = '{"1hVisits":{"ckValue":32,"type":"h","ckExp":"1"}}';
//var cookieObj = '{"1hVisits":{"ckValue":12,"type":"h","ckExp":"1"},"7dVisits":{"ckValue":10,"type":"d","ckExp":"7"},"2mVisits":{"ckValue":22,"type":"m","ckExp":"2"}}';
//pixel.setNDayCookie("v2y", 34, "2y", "v7d", 24, "7d");		//1 days.
pixel.setCookie(cookieObj);		//1 days.
console.log("1hVisits: " + pixel.getCookie("1hVisits"));

setCookie: function (json) {
    var currTime = parseInt((new Date().getTime())/1000);
    var cookieVal = "", newCookieVal = "", oldCookieVal = "";
    var expdate = new Date();
    var expTime = 0;
    var jsonObj = JSON.parse(json);
    var vcookie = "_vtc";
    var i = 0, cookieValLen = 0;
    var jsonCookieVal = pixel.getCookie();

    if(jsonCookieVal !== null && jsonCookieVal !== "") {
        cookieVal = JSON.parse(jsonCookieVal);
        cookieValLen = Object.keys(cookieVal).length;
        }

    for(var cookie in jsonObj) {
        i++;
        if(cookieVal.hasOwnProperty(cookie)){
            if(parseInt(cookieVal[cookie].ckExp) > currTime)
                cookieVal[cookie].ckValue = jsonObj[cookie].ckValue;
            else {
                cookieVal[cookie].ckValue = "";
                cookieVal[cookie].ckExp = 0;
            }
            newCookieVal += cookie + "=" + cookieVal[cookie].ckValue + "|" + cookieVal[cookie].ckExp ;
        }
        else {
            switch(jsonObj[cookie].type) {
                case 'd':
                    expdate.setDate(expdate.getDate() + parseInt(jsonObj[cookie].ckExp));
                    expTime = expdate.getTime() / 1000;
                    break;
                case 'm':
                    expdate.setDate(expdate.getDate() + (parseInt(jsonObj[cookie].ckExp) * 30));
                    expTime = expdate.getTime() / 1000;
                    break;
                case 'y':
                    expdate.setDate(expdate.getDate() + (parseInt(jsonObj[cookie].ckExp) * 30 * 12));
                    expTime = expdate.getTime() / 1000;
                    break;
                case "h":
                    expdate.setDate(expdate.getDate());
                    expTime = (expdate.getTime() + (parseInt(jsonObj[cookie].ckExp) * 60 * 60 * 1000)) / 1000;
                    break;
                default:
                    expdate.setDate(expdate.getDate() + 30);
                    expTime = expdate.getTime() / 1000;
            }
            newCookieVal += cookie + "=" + jsonObj[cookie].ckValue + "|" + expTime;
        }
        if(i < Object.keys(jsonObj).length || ( Object.keys(jsonObj).length === 1 && cookieValLen > 0 ) )
            newCookieVal += ":";
    }
    i = 0;
    for(var cookie in cookieVal) {
        i++;
        if(!jsonObj.hasOwnProperty(cookie)) {
            if(parseInt(cookieVal[cookie].ckExp) < currTime) {
                cookieVal[cookie].ckValue = "";
                cookieVal[cookie].ckExp = 0;
            }

            newCookieVal += cookie + "=" + cookieVal[cookie].ckValue + "|" + cookieVal[cookie].ckExp;
            if(i < cookieValLen)
                newCookieVal += ":";
        }
    }

    //Finally set the cookie with new, updated and non updated values
    expdate.setDate(expdate.getDate() + 365);
    var tcookieVal = newCookieVal + oldCookieVal + ((expdate == null) ? "" : "; expires=" + expdate.toUTCString()) + "; path=/";
    document.cookie = vcookie + "=" + tcookieVal;
},

getCookie: function () {
    var currentcookie = document.cookie;
    var i, vCookie = "_vtc";
    var jsonObj = "";
    var currTime = parseInt((new Date().getTime())/1000);
    if (currentcookie.length > 0) {
        var firstidx = currentcookie.indexOf(vCookie + "=");
        if (firstidx != -1) {
            firstidx = firstidx + vCookie.length + 1;
            var lastidx = currentcookie.indexOf(";", firstidx);
            if (lastidx == -1) {
                lastidx = currentcookie.length;
            }
            if (decodeURIComponent(currentcookie.substring(firstidx, lastidx)) !== undefined && decodeURIComponent(currentcookie.substring(firstidx, lastidx)) != null) {
                var cVal = decodeURIComponent(currentcookie.substring(firstidx, lastidx));
                var cValSplit = cVal.split(/=|:|\|/);
                jsonObj += "{";
                for(i=0; i<cValSplit.length; i+=3) {
                    if(parseInt(cValSplit[i+2]) < currTime ) {
                        cValSplit[i+1] = 0;
                        cValSplit[i+2] = 0;
                    }
                    //{"1dVisits":{"ckValue":12,"type":"d","ckExp":"1"}
                    jsonObj +=  "\"" + cValSplit[i] + "\"" + ":" + "{" + "\"ckValue\":" + cValSplit[i+1] + ",\"ckExp\":" + cValSplit[i+2] + "}";
                    if(i+3 < cValSplit.length)
                        jsonObj += ",";
                }
                jsonObj += "}";

                if(arguments.length == 0)
                    return jsonObj;
                else {
                    var cookieVal = JSON.parse(jsonObj);
                    return cookieVal[arguments[0]].ckValue;
                }
            }
        }
    }
    return "";
}
