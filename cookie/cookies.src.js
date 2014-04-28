var pixel = {
    params: "?account_id=VIZVRM943&section=1&level=1",
    pageStatusFlag: false,
    checkMyReadyState: null,
    parse: function () {
        var baseURL = ("https:" == document.location.protocol ? "https://ssl" : "http://serv2") + ".vizury.com/analyze/analyze.php";
        var pixelfirestatus = false;
        var visit_count1Day = "daily_visit_count";
        //var visits1dCount = 0, visits1d = pixel.getCookieValue(visit_count1Day);

        try {
            pixel.checkMyReadyState = setInterval(function () {
                pixel.pageloadStatus();
                if (pixel.pageStatusFlag == true) {
                    var pixelfireflag = false;

                    //pixel.setNDayCookie("v2y", 34, "2y", "v7d", 24, "7d");		//1 days.
                    pixel.setNDayCookie("v2y", 24, "2y", "v7d", 14, "7d", "v4h", 3, "4h", "v1m", 12, "1m");		//1 days.
                    //pixel.setNDayCookie("v2y", 18, "2y", "v7d", 10, "7d");		//1 days.
                    pixelfireflag = true;

                    if (pixelfireflag && (!(pixelfirestatus))) {
                        var analyze = document.createElement("iframe");
                        analyze.src = baseURL + pixel.params;
                        analyze.scrolling = "no";
                        analyze.width = 1;
                        analyze.height = 1;
                        analyze.marginheight = 0;
                        analyze.marginwidth = 0;
                        analyze.frameborder = 0;
                        analyze.style.display = 'none';
                        var node = document.getElementsByTagName("script")[0];
                        node.parentNode.insertBefore(analyze, node);
                        pixelfirestatus = true;
                    }
                }
            }, 3000, "Javascript");
        } catch (error) {
            var analyze = document.createElement("iframe");
            analyze.src = baseURL + pixel.params + "&param=999";
            analyze.scrolling = "no";
            analyze.width = 1;
            analyze.height = 1;
            analyze.marginheight = 0;
            analyze.marginwidth = 0;
            analyze.frameborder = 0;
            analyze.style.display = 'none';
            var node = document.getElementsByTagName("script")[0];
            node.parentNode.insertBefore(analyze, node);
        }
    },
    pageloadStatus: function () {
        if (document.readyState === "interactive" || document.readyState === "complete") {
            pixel.pageStatusFlag = true;
            clearInterval(pixel.checkMyReadyState);
        } else {
            pixel.pageStatusFlag = false;
        }
    },
    getCookieValue: function (key) {
        var currentcookie = document.cookie;
        if (currentcookie.length > 0) {
            var firstidx = currentcookie.indexOf(key + "=");
            if (firstidx != -1) {
                firstidx = firstidx + key.length + 1;
                var lastidx = currentcookie.indexOf(";", firstidx);
                if (lastidx == -1) {
                    lastidx = currentcookie.length;
                }
                if (unescape(currentcookie.substring(firstidx, lastidx)) !== undefined && unescape(currentcookie.substring(firstidx, lastidx)) != null) {
                    return unescape(currentcookie.substring(firstidx, lastidx));
                }
            }
        }
        return "";
    },
    setNDayCookie: function (cname1, cvalue1, cexpdays1) {
        var vcookie = "_vtc";
        var currTime = parseInt((new Date().getTime())/1000);
        var cookieVal = pixel.getCookieValue("_vtc"), newCookieVal="";
        var oldCookieVal=cookieVal;
        var expdate = new Date();
        var expTime = 0;
        var res, pattern, tnum, tstr="", subcExist=false;
        var oldnewCookieVal = "";
        var xD = "undefined";

        for(var i = 0; i < arguments.length; i+=3) {
            //Pattern to check whether current argument (cookie) already exist in the cookie
            pattern=new RegExp(".*:"+arguments[i]+"=.*"+"\|^"+arguments[i]+"=.*");
            subcExist = pattern.test(cookieVal);

            if(subcExist) {
                //If already exist then extract its expiry time
                pattern=new RegExp(":?" + arguments[i] + "=" +"[a-zA-Z0-9]+" + "\\|" + "([0-9.]+)");
                res = cookieVal.match(pattern);

                if(typeof res !== xD && res !== null) {
                    if(typeof res[1] !== xD && res[1] !== null)
                        expTime = parseInt(res[1]);
                    else if(typeof res[2] !== xD && res[2] !== null)
                        expTime = parseInt(res[2]);
                }

                //If current argument already exist then remove it from oldCookie value as we are going to update this and append it to new cookie
                pattern = new RegExp("(:?" + arguments[i] + "=" +"[a-zA-Z0-9]+" + "\\|" + "[0-9.]+)");
                res = cookieVal.match(pattern);

                if(typeof res !== xD && res !== null) {
                    if(typeof res[1] !== xD && res[1] !== null)
                        oldCookieVal = oldCookieVal.replace(res[1],"");
                    else if(typeof res[2] !== xD && res[2] !== null)
                        oldCookieVal = oldCookieVal.replace(res[2],"");
                }
            }
            else {
                //If cookie already doesn't exist then get its expiry time which can be in 1h,1d,1m,1y format and set it accordingly
                tnum = parseInt(arguments[i+2].match(/\d+/g));
                tstr = arguments[i+2].match(/\D/g);
                if(typeof tnum === xD || tnum === null)
                    tnum = 0;

                if(typeof tstr === xD || tnum === null)
                    tstr = "";

                if(tstr == 'd') {
                    expdate.setDate(expdate.getDate() + tnum);
                    expTime = expdate.getTime() / 1000;
                }
                else if(tstr == 'm') {
                    expdate.setDate(expdate.getDate() + (tnum * 30));
                    expTime = expdate.getTime() / 1000;
                }
                else if(tstr == 'y') {
                    expdate.setDate(expdate.getDate() + (tnum * 30 * 12));
                    expTime = expdate.getTime() / 1000;
                }
                else if(tstr == 'h') {
                    expdate.setDate(expdate.getDate());
                    expTime = (expdate.getTime() + (tnum * 60 * 60 * 1000)) / 1000;
                }
                else {
                    expdate.setDate(expdate.getDate() + 30);
                    expTime = expdate.getTime() / 1000;
                }
            }

            //Check if the cookie is already expired
            if(expTime > currTime) {
                newCookieVal += arguments[i] + "=" + arguments[i+1] + "|" + parseInt(expTime);
            }
            else {
                newCookieVal += arguments[i] + "=" + "" + "|" + 0;
            }

            if(i+3 < arguments.length)
                newCookieVal += ":";
        }

        //Check the remaining values in old cookie and update them if they are already expired.
        if(oldCookieVal !== "") {
            var charstr = oldCookieVal.match(/^(.)/);
            if(typeof charstr !== xD && charstr !== null && typeof charstr[1] !== xD && charstr[1] !== null && charstr[1] != ":") {
                var oldCookieSplit = oldCookieVal.split(/=|:|\|/);
                for(i=1; i<oldCookieSplit.length; i+=3) {
                    expTime = parseInt(oldCookieSplit[i+2]);

                    if(expTime > currTime) {
                        oldnewCookieVal += oldCookieSplit[i] + "=" + oldCookieSplit[i+1] + "|" + parseInt(expTime);
                    }
                    else {
                        oldnewCookieVal += oldCookieSplit[i] + "=" + "" + "|" + 0;
                    }

                    if(i+3 < oldCookieSplit.length)
                        oldnewCookieVal += ":";
                }
                oldnewCookieVal = ":" + oldnewCookieVal;
            }
        }

        //Finally set the cookie with new, updated and non updated values
        expdate.setDate(expdate.getDate() + 365);
        var tcookieVal = newCookieVal + oldnewCookieVal + ((expdate == null) ? "" : "; expires=" + expdate.toUTCString()) + "; path=/";
        document.cookie = vcookie + "=" + tcookieVal;
    }
}