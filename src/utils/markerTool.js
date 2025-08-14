export default class MarkerTool {
  static get isInline() {
    return true;
  }

  constructor({ api }) {
    this.api = api;
    this.button = null;
    this.tag = 'MARK';
    this.class = 'cdx-marker';
  }

  /**
   * Editor.js가 하이라이트 HTML 태그를 저장/붙여넣기 시 보존하도록 하는 설정
   */
  static get sanitize() {
    return {
      mark: {
        class: 'cdx-marker'
      }
    };
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.innerHTML = 'H';
    this.button.classList.add(this.api.styles.inlineToolButton);

    // 스타일 직접 추가 (maker.css 대체)
    const style = document.createElement('style');
    style.innerHTML = `
      .cdx-marker {
        background: yellow;
        padding: 0 2px;
      }
    `;
    document.head.appendChild(style);

    return this.button;
  }

  surround(range) {
    if (!range) {
      return;
    }

    const selectedText = range.extractContents();
    const mark = document.createElement(this.tag);
    mark.classList.add(this.class);
    mark.appendChild(selectedText);
    range.insertNode(mark);
  }

  checkState(selection) {
    const markTag = this.api.selection.findParentTag(this.tag, this.class);
    this.button.classList.toggle(this.api.styles.inlineToolButtonActive, !!markTag);
  }
}
