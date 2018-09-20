module.exports = {
  stripHtml: (html, convertJumps = false) =>
    html
      ? convertJumps
        ? html.replace(/(<br>|<br\/>|<br \/>)/gm, "\n").replace(/<(?:.)*?>/gm, " ")
        : html.replace(/<(?:.|\n)*?>/gm, " ")
      : ""
};
