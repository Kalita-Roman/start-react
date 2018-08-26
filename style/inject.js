module.exports = function (source) {
    this.cacheable();
    console.log(__dirname);
    return `@import '${__dirname}\_constants.scss'; ${source}`;
};
