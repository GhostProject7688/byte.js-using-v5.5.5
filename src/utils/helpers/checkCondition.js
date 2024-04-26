class CheckCondition {
  static hasAnd(msg) {
    return msg.includes("&&");
  }

  static hasOr(msg) {
    return msg.includes("||");
  }

  static hasEqual(msg) {
    return msg.includes("==");
  }

  static hasNotEqual(msg) {
    return msg.includes("!=");
  }

  static hasGreater(msg) {
    return msg.includes(">");
  }

  static hasLesser(msg) {
    return msg.includes("<");
  }

  static hasGE(msg) {
    return msg.includes(">=");
  }

  static hasLE(msg) {
    return msg.includes("<=");
  }

  static solveEqual(msg) {
    const parts = msg.split("==");
    return parts[0] === parts[1];
  }

  static solveNotEqual(msg) {
    const parts = msg.split("!=");
    return parts[0].addBrackets() !== parts[1].addBrackets();
  }

  static solveGreater(msg) {
    const parts = msg.split(">");
    return parts.every((x) => isNaN(x)) ? parts[0] > parts[1] : Number(parts[0]) > Number(parts[1]);
  }

  static solveLesser(msg) {
    const parts = msg.split("<");
    return parts.every((x) => isNaN(x)) ? parts[0] < parts[1] : Number(parts[0]) < Number(parts[1]);
  }

  static solveLE(msg) {
    const parts = msg.split("<=");
    return parts.every((x) => isNaN(x)) ? parts[0] <= parts[1] : Number(parts[0]) <= Number(parts[1]);
  }

  static solveGE(msg) {
    const parts = msg.split(">=");
    return parts.every((x) => isNaN(x)) ? parts[0] >= parts[1] : Number(parts[0]) >= Number(parts[1]);
  }

  static solveAnd(msg) {
    return msg.split("&&").map(this.solveCondition).join("&&");
  }

  static solveOr(msg) {
    return msg.split("||").map(this.solveCondition).join("||");
  }

  static solveCondition(condition) {
    if (this.hasOr(condition)) return this.solveOr(condition);
    if (this.hasAnd(condition)) return this.solveAnd(condition);
    if (this.hasEqual(condition)) return this.solveEqual(condition);
    if (this.hasNotEqual(condition)) return this.solveNotEqual(condition);
    if (this.hasGE(condition)) return this.solveGE(condition);
    if (this.hasLE(condition)) return this.solveLE(condition);
    if (this.hasGreater(condition)) return this.solveGreater(condition);
    if (this.hasLesser(condition)) return this.solveLesser(condition);
    return condition;
  }

  static solve(msg) {
    const parts = msg.split("(");
    const final = [];
    for (const part of parts) {
      if (part.trim() === "") {
        final.push("");
        continue;
      }
      const solve = this.solveAnd(part);
      final.push(solve);
    }

    let result = final.join("(");
    if (result.split("(").length !== result.split(")").length) {
      result += ")".repeat(result.split("(").length - result.split(")").length);
    }
    return result;
  }
}

module.exports = {
  CheckCondition,
};
