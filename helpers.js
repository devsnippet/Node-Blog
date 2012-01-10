const SECONDS_IN_MINUTE = 60, 
	  SECONDS_IN_HOUR = 3600,
	  SECONDS_IN_DAY = 86400
	  SECONDS_IN_MONTH = 2629743,
	  SECONDS_IN_YEAR = 31556926,

Date.prototype.toISO8601 = function(){
	var d = this.getDate()+'',
		m = (this.getMonth()+1)+'',
		y = this.getFullYear()+'',
		h = this.getHours()+'',
		mi = this.getMinutes()+'',
		s = this.getSeconds()+'';

	return y+'-'+((m.length == 1)?'0'+m:m)+'-'+((d.length == 1)?'0'+d:d)
		+'T'+((h.length == 1)?'0'+h:h)+':'+((mi.length == 1)?'0'+mi:mi)+':'+((s.length == 1)?'0'+s:s)+'Z';
};

Date.prototype.humanString = (function(){
	var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];

	return function(){
		var d = this.getDate(),
			m = this.getMonth(),
			y = ' '+this.getFullYear(),
			h = this.getHours()+'',
			mi = this.getMinutes()+'',
			s = this.getSeconds()+'';

		return y+'年'+months[m]+'月'+d+'日 '+((h.length == 1)?'0'+h:h)+':'+((mi.length == 1)?'0'+mi:mi)+':'+((s.length == 1)?'0'+s:s);
	};
})();

Date.prototype.timeSince = function(){
	var t = (new Date().getTime()-this.getTime())/1000,
		d, n, unit;

	if(t < SECONDS_IN_MINUTE){
		return 'just now';
	}
	if(t < SECONDS_IN_HOUR){
		d = SECONDS_IN_MINUTE;
		unit = 'minute';
	}else if(t < SECONDS_IN_DAY){
		d = SECONDS_IN_HOUR;
		unit = 'hour';
	}else if(t < SECONDS_IN_MONTH){
		d = SECONDS_IN_DAY;
		unit = 'day';
	}else if(t < SECONDS_IN_YEAR){
		d = SECONDS_IN_MONTH;
		unit = 'month';
	}else{
		d = SECONDS_IN_YEAR;
		unit = 'year';
	}

	n = Math.floor(t/d);

	return n+' '+unit+((n>1)?'s':'')+' ago';
};

String.prototype.sanitise = function(){
	return this.trim().replace(/<([^>]*)>/, '&;lt;$1&gt');
};

exports.ajaxPageList = (function (cat, num, perpage, curpage,mpurl) {
		if(cat==0){
			var cat = "/";
		}else{
			var cat = '/'+cat+'/';
		}
		var multipage = '';
		if(num > perpage) {
			var page = 3;
			var offset = 2;

			var pages = Math.ceil(num / perpage);

			if(page > pages) {
				var from = 1;
				var to = pages;
			} else {
				var from = (curpage - offset);
				var to = (from+page-1);
				if(from < 1) {
					to = (curpage + 1 - from);
					from = 1;
					if((to - from) < page) {
						to = page;
					}
				} else if(to > pages) {
					from = (pages - page + 1);
					to = pages;
				}
			}
			multipage += ((curpage - offset) > 1 && pages > page ? '<a href="'+mpurl+cat+'1'+config.app_ext+'" class="first">1 ...</a>' : '');
            if(curpage > 1){

                multipage += (curpage > 1 && '<a href="'+mpurl+cat+(curpage - 1)+config.app_ext+'" class="prev">&lsaquo;&lsaquo;</a>');
            }else{
                multipage += "";
            }
			for(var i = from; i <= to; i++) {
				multipage += i == curpage ? '<strong style="color:#09C">'+i+'</strong>' :
				'<a href="'+mpurl+cat+i+config.app_ext+'">'+i+'</a>';
			}

            if((curpage + 1)<=pages)
			multipage += ((curpage + 1)<=pages && '<a href="'+mpurl+cat+(curpage + 1)+config.app_ext+'" class="next">&rsaquo;&rsaquo;</a>')+
			(to < pages ? '<a href="'+mpurl+cat+pages+config.app_ext+'" class="last">...</a>' : '');

			multipage = multipage ? '<div class="pages">'+('<em>共&nbsp;'+pages+'页'+num+'&nbsp;条</em>')+multipage+'</div>' : '';
		}
		return multipage;

	});

exports.Helpers = (function(){
	var crypto = require('crypto');
	
	return {
		gravatar:function(email){
			return 'http://www.gravatar.com/avatar/'+
				crypto.createHash('md5').
					update(email.trim().toLowerCase()).digest('hex')+
				'?s=48';
		}
	};
})();