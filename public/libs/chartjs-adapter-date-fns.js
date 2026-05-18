/*!
 * Minimal Chart.js date adapter for WLBT dashboard
 * Handles YYYY-MM-DD string format only
 */
(function() {
  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function parseDate(val) {
    if (val instanceof Date) return val;
    if (typeof val === 'number') return new Date(val);
    // YYYY-MM-DD
    var parts = String(val).split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    return new Date(val);
  }

  var adapter = {
    formats: function() {
      return { datetime:'MMM d, yyyy', millisecond:'h:mm:ss.SSS a', second:'h:mm:ss a',
               minute:'h:mm a', hour:'hA', day:'MMM d', week:'PP', month:'MMM yyyy',
               quarter:"'Q'Q - yyyy", year:'yyyy' };
    },
    parse: function(value, format) {
      if (value === null || value === undefined) return null;
      var d = parseDate(value);
      return isNaN(d.getTime()) ? null : d.getTime();
    },
    format: function(time, format) {
      var d = new Date(time);
      var day = d.getDate();
      var month = d.getMonth();
      var year = d.getFullYear();
      format = format || 'MMM';
      return format
        .replace('yyyy', year)
        .replace('MMM', MONTHS[month])
        .replace('MMMM', MONTHS_FULL[month])
        .replace('MM', String(month+1).padStart ? String(month+1).padStart(2,'0') : (month+1 < 10 ? '0'+(month+1) : ''+(month+1)))
        .replace('dd', day < 10 ? '0'+day : ''+day)
        .replace('d', day);
    },
    add: function(time, amount, unit) {
      var d = new Date(time);
      if (unit === 'millisecond') d.setMilliseconds(d.getMilliseconds() + amount);
      else if (unit === 'second') d.setSeconds(d.getSeconds() + amount);
      else if (unit === 'minute') d.setMinutes(d.getMinutes() + amount);
      else if (unit === 'hour') d.setHours(d.getHours() + amount);
      else if (unit === 'day') d.setDate(d.getDate() + amount);
      else if (unit === 'week') d.setDate(d.getDate() + amount * 7);
      else if (unit === 'month') d.setMonth(d.getMonth() + amount);
      else if (unit === 'quarter') d.setMonth(d.getMonth() + amount * 3);
      else if (unit === 'year') d.setFullYear(d.getFullYear() + amount);
      return d.getTime();
    },
    diff: function(a, b, unit) {
      var ms = a - b;
      if (unit === 'millisecond') return ms;
      if (unit === 'second') return ms / 1000;
      if (unit === 'minute') return ms / 60000;
      if (unit === 'hour') return ms / 3600000;
      if (unit === 'day') return ms / 86400000;
      if (unit === 'week') return ms / 604800000;
      if (unit === 'month') return ms / 2628000000;
      if (unit === 'quarter') return ms / 7884000000;
      if (unit === 'year') return ms / 31536000000;
      return ms;
    },
    startOf: function(time, unit, weekday) {
      var d = new Date(time);
      if (unit === 'second') { d.setMilliseconds(0); }
      else if (unit === 'minute') { d.setSeconds(0,0); }
      else if (unit === 'hour') { d.setMinutes(0,0,0); }
      else if (unit === 'day') { d.setHours(0,0,0,0); }
      else if (unit === 'week') { d.setHours(0,0,0,0); d.setDate(d.getDate()-d.getDay()); }
      else if (unit === 'month') { d.setHours(0,0,0,0); d.setDate(1); }
      else if (unit === 'quarter') { d.setHours(0,0,0,0); d.setDate(1); d.setMonth(Math.floor(d.getMonth()/3)*3); }
      else if (unit === 'year') { d.setHours(0,0,0,0); d.setMonth(0,1); }
      return d.getTime();
    },
    endOf: function(time, unit) {
      var d = new Date(time);
      if (unit === 'day') { d.setHours(23,59,59,999); }
      else if (unit === 'month') { d.setMonth(d.getMonth()+1,0); d.setHours(23,59,59,999); }
      else if (unit === 'year') { d.setMonth(11,31); d.setHours(23,59,59,999); }
      return d.getTime();
    }
  };

  // Register with Chart.js 3.x or 4.x
  if (typeof Chart !== 'undefined') {
    if (Chart._adapters) {
      Chart._adapters._date.override(adapter);
    }
  }
})();
