webpackHotUpdate("static/development/pages/index.js",{

/***/ "./components/KeywordTags.js":
/*!***********************************!*\
  !*** ./components/KeywordTags.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
var _jsxFileName = "/Users/jasonroundtree/projects/blog/web/components/KeywordTags.js";

var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;
 // const TagsContainer = styled.div`
//     display: flex;
//     justify-content: center;
// `

var TagBtn = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].button.withConfig({
  displayName: "KeywordTags__TagBtn",
  componentId: "sc-1eepvlk-0"
})(["padding:10px 15px;margin:15px 0 0 15px;color:var(--secondary-color);font-size:1.2em;border:none;background-color:var(--primary-color);font-family:'Nanum Gothic Coding',monospace;&:hover{cursor:pointer;background-color:var(--primary-darker);}"]);
var TagCount = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].span.withConfig({
  displayName: "KeywordTags__TagCount",
  componentId: "sc-1eepvlk-1"
})([""]);

function KeywordTags(props) {
  var _this = this;

  // console.log('props: ', props)
  props.tags.sort(function (a, b) {
    return a.name > b.name ? 1 : -1;
  });
  return __jsx("div", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32,
      columnNumber: 9
    }
  }, props.tags.length > 0 && __jsx(TagBtn, {
    onClick: props.handleTagFilter,
    id: "clearFilter",
    className: props.filteredTags.length > 0 ? '' : 'selectedTag',
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35,
      columnNumber: 17
    }
  }, "All Posts"), props.tags.map(function (tag) {
    return tag.count > 0 && __jsx(TagBtn, {
      key: tag.name,
      id: tag._id,
      onClick: props.handleTagFilter,
      className: props.filteredTags.includes(tag._id) ? 'selectedTag' : '',
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 50,
        columnNumber: 21
      }
    }, tag.name, "\xA0", __jsx("span", {
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 62,
        columnNumber: 25
      }
    }, "(", tag.count, ")"));
  }));
}

/* harmony default export */ __webpack_exports__["default"] = (KeywordTags);

/***/ })

})
//# sourceMappingURL=index.js.bf99df5ed092cbbaf183.hot-update.js.map