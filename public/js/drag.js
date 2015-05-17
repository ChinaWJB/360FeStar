define(['util'], function (util) {
	/**
	* 拖拽化一个对象，以其父元素为限界参照
	*/
	function Drag (config) {
		this.target = util.$.find(config.target);
		this.parent = util.$.find(config.parent);
		// 根据tag，做不同的拖拽化
		this.tag = config.tag;
		this.init(this);
	}

	Drag.prototype = {
		constructor: 'Drag',

		init: function (obj) {
			obj.disX = 0;
			obj.disY = 0;
			obj.dragTag = false;
			obj.controlTag = false;
			// 将处理事件和对象绑定
			obj._handleDown = util.$.bind(obj, obj.handleDown);
			obj._handleMove = util.$.bind(obj, obj.handleMove);
			obj._handleUp = util.$.bind(obj, obj.handleUp);
			util.$.addEvent(obj.target, 'mousedown', obj._handleDown);
		},

		// 鼠标按下处理事件
		handleDown: function (event) {
			var e =  util.$.getEvent(event);
			util.$.stopPropagation(e);

			this.disX = e.clientX - this.target.offsetLeft;
			this.disY = e.clientY - this.target.offsetTop;
			
			if (this.tag == 'drag') {
				this.dragTag = true;
			} else {
				this.controlTag = true;
			}
			
			var that = this;
			util.$.addEvent(document, 'mousemove', that._handleMove);
			util.$.addEvent(document, 'mouseup', that._handleUp);
		},

		// 鼠标拖拽移动处理事件
		handleMove: function (event) {
			var e = util.$.getEvent(event);
			util.$.stopPropagation(e);

			// 对于普通拖拽的设置
			if (this.dragTag) {
				var oLeft = e.clientX - this.disX,
					oTop = e.clientY - this.disY,
					limitWidth = this.parent.clientWidth - this.target.offsetWidth,
					limitHeight = this.parent.clientHeight - this.target.offsetHeight;

				if (oLeft < 0) {
					oLeft = 0;
				} else if (oLeft > limitWidth) {
					oLeft = limitWidth;
				}
				if (oTop < 0) {
					oTop = 0;
				} else if (oTop > limitHeight) {
					oTop = limitHeight;
				}

				this.target.style.left = oLeft + 'px';
				this.target.style.top = oTop + 'px';
			}
			// 对于右下角改变大小拖拽的设置
			if (this.controlTag) {
				var limitNode = this.parent.offsetParent;
				var oWidth = e.clientX - this.disX + this.target.offsetWidth,
					oHeight = e.clientY - this.disY + this.target.offsetHeight,
					limitWidth = limitNode.clientWidth,
					limitHeight = limitNode.clientHeight;

				if (oWidth + this.parent.offsetLeft > limitWidth) {
					oWidth = limitWidth - this.parent.offsetLeft;
				} 
				if (oHeight + this.parent.offsetTop > limitHeight) {
					oHeight = limitHeight - this.parent.offsetTop;
				} 

				this.parent.style.width = oWidth + 'px';
				this.parent.style.height = oHeight + 'px';
			}
		},

		// 鼠标松开处理事件
		handleUp: function () {
			document.onmousemove = null;
			document.onmouseup = null;
			if (this.dragTag) {
				this.dragTag = false;
			} else {
				this.controlTag = false;
			}
		}
	};

	return {
		Drag: Drag
	}
})