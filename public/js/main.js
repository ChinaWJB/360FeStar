require(['drag','util'], function (drag, util) {
	// 让目标元素实现拖拽 和 改变大小控制
	var optDrag = {target:'#drag',parent:'.display',tag:'drag'},
		drag1 = new drag.Drag(optDrag),
		optControl = {target:'#change', parent:'#drag',tag:'control'},
		drag2 = new drag.Drag(optControl);

	// 图片上传元素 & 图片渲染目标元素
	var inputEle = util.$.find('#file'),
		picWrap = util.$.find('#drag');

	util.$.addEvent(inputEle, 'change', showImg);

	function showImg () {
		if (window.FileReader) {
			var reader = new FileReader(),
				file = inputEle.files[0],
				filter = /^(?:image\/bmp|image\/gif|image\/jpeg|image\/png|image\/svg\+xml|image\/x\-icon)$/i;

			if (!filter.test(file.type)) { alert("请选择一张图片"); return; }

			reader.onload = function () {
				//将图像设成目标元素(可拖拽&改变大小)的背景图片
				picWrap.style.background = "url("+this.result+") 0 0 no-repeat";
				//让图像跟随目标元素的大小发生变化，放弃了不支持的老浏览器版本！！！
				picWrap.style.backgroundSize = '100% 100%';
			}
			reader.readAsDataURL(file);
		} else if (navigator.appName === "Microsoft Internet Explorer") {
			picWrap.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = inputEle.value;
		}
	}
});
