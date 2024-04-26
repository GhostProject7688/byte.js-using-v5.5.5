class Time {
  /**
   * @param  {number} time
   * @return {{
   *  units : {
   *      years: number,
   *      months: number,
   *      weeks:number,
   *      days:number,
   *      hours:number,
   *      minutes: number,
   *      seconds:number,
   *      ms:number
   *  },
   *  humanize():string,
   *  toString():string
   *  }}
   */
  static format(time) {
    const date = (ms) => {
      const res = Math.trunc(Math.abs(time) / ms);
      time -= res * ms;
      return res;
    };
    const units = {
      years: date(31536000000),
      months: date(2628000000), // Standard month duration
      weeks: date(604800000),
      days: date(86400000),
      hours: date(3600000),
      minutes: date(60000),
      seconds: date(1000),
      ms: date(1),
    };
    const data = {
      units,
      humanize: () => {
        const string = [];
        Object.entries(units)
          .slice(0, -1)
          .forEach(([unit, value]) => {
            if (value) {
              const abbr = unit === 'months' ? 'mon' : unit.charAt(0);
              string.push(`${value}${abbr}`);
            }
          });
        return string.join(" ");
      },
      toString: () => this.parse(data.humanize()).format,
    };
    return data;
  }

  /**
   * @param  {string | number } time
   * @returns {{
   *      ms : number;
   *      format : string;
   * }}
   */
  static parse(time) {
    if (!["string", "number"].includes(typeof time))
      throw TypeError("'time' must be a string or number");
    if (typeof time === "number")
      return {
        ms: time,
        format: this.format(time).toString(),
      };
    else {
      const Hash = new Map();

      time.split(" ").forEach((x) => {
        if (x.endsWith("y"))
          Hash.set("y", {
            format: pluralize(Number(x.split("y")[0]), "year"),
            ms: Number(x.split("y")[0]) * 31536000000,
            order: 1,
          });
        if (x.endsWith("mon") || x.endsWith("M"))
          Hash.set("mon", {
            format: pluralize(Number(x.split("mon")[0].split("M")[0]), "month"),
            ms: Number(x.split("mon")[0].split("M")[0]) * 2628000000, // Standard month duration
            order: 2,
          });
        if (x.endsWith("w"))
          Hash.set("w", {
            format: pluralize(Number(x.split("w")[0]), "week"),
            ms: Number(x.split("w")[0]) * 604800000,
            order: 3,
          });
        if (x.endsWith("d"))
          Hash.set("d", {
            format: pluralize(Number(x.split("d")[0]), "day"),
            ms: Number(x.split("d")[0]) * 86400000,
            order: 4,
          });
        if (x.endsWith("h") || x.endsWith("hr"))
          Hash.set("h", {
            format: pluralize(Number(x.split("h")[0].split("hr")[0]), "hour"),
            ms: Number(x.split("hr")[0].split("h")[0]) * 3600000,
            order: 5,
          });
        if (x.endsWith("min") || x.endsWith("m"))
          Hash.set("min", {
            format: pluralize(
              Number(x.split("min")[0].split("m")[0]),
              "minute",
            ),
            ms: Number(x.split("min")[0].split("m")[0]) * 60000,
            order: 6,
          });
        if (x.endsWith("s") && !x.endsWith("ms"))
          Hash.set("s", {
            format: pluralize(Number(x.split("s")[0]), "second"),
            ms: Number(x.split("s")[0]) * 1000,
            order: 7,
          });
        if (x.endsWith("ms"))
          Hash.set("ms", {
            ms: Number(x.split("ms")[0]),
            order: 8,
          });
      });
      const data = [...Hash.values()].sort(compare);

      const ms = data.map((x) => x.ms).reduce((a, b) => a + b,0);
      const format = data
        .filter((x) => x.format)
        .map((x) => x.format)
        .join(", ");

      return {
        ms,
        format,
      };
    }
  }
  /**
   * @param  {number} time
   */
  static digital(time) {
    if (time < 0) {
      throw new Error("Negative time values are not supported.");
    }

    let seconds = Math.trunc(time / 1000);
    let res = [];
    let i = 0;
    const a = [3600, 60, 60];
    while (i < 2) {
      const num = Math.trunc(seconds / a[i]).toString();
      if (num == 0 && i == 0) {
      } else {
        res.push(num.length === 1 ? `0${num}` : num);
      }
      seconds = seconds % a[i];
      i++;
    }
    res.push(seconds.toString().length === 1 ? `0${seconds}` : seconds);
    return res.join(":");
  }
}

module.exports = {
  Time,
};

function compare(a, b) {
  if (a.order < b.order) {
    return -1;
  }
  if (a.order > b.order) {
    return 1;
  }
  return 0;
}

const pluralize = (num, txt, suffix = "s") =>
  `${num} ${txt}${num !== 1 ? suffix : ""}`;
