const duration = 400
const slideUp = (target, anim = true) => {
   if (!target.classList.contains('-anim')) {
      target.classList.add('-anim');
      if (anim) {
         target.style.transitionProperty = 'height, margin, padding';
         target.style.transitionDuration = duration + 'ms';
      }
      target.style.height = target.offsetHeight + 'px';
      target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => {
         target.hidden = true;
         target.style.removeProperty('height');
         target.style.removeProperty('padding-top');
         target.style.removeProperty('padding-bottom');
         target.style.removeProperty('margin-top');
         target.style.removeProperty('margin-bottom');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('-anim');
      }, duration)
   }
}
const slideDown = (target, anim = true) => {
   if (!target.classList.contains('-anim')) {
      target.classList.add('-anim');
      if (target.hidden) {
         target.hidden = false;
      }
      let height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      if (anim) {
         target.style.transitionProperty = 'height, margin, padding';
         target.style.transitionDuration = duration + 'ms';
      }
      target.style.height = height + 'px';
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      window.setTimeout(() => {
         target.style.removeProperty('height');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('-anim');
      }, duration)
   }
}
const slideToggle = (target) => {
   if (target.hidden) {
      return slideDown(target);
   } else {
      return slideUp(target);
   }
}
class Me {
   constructor(type) {
      this.typeMedia = type
   }
   init() {
      this.elements = document.querySelectorAll('[data-me]')
      this.objects = []

      if (this.elements.length > 0) {
         for (let index = 0; index < this.elements.length; index++) {
            const meElement = this.elements[index];

            const obj = {}
            obj.el = meElement
            const dataAttr = meElement.dataset.me.split(',').map(item => item.trim())
            obj.dataAttr = {
               size: dataAttr[0],
               block: dataAttr[1],
               index: dataAttr[2],
            }
            obj.parentElement = obj.el.parentElement
            obj.indexParent = Array.from(obj.parentElement.children).indexOf(obj.el)
            this.objects.push(obj)
         }
         for (let index = 0; index < this.objects.length; index++) {
            const obj = this.objects[index];
            const mediaQueryList = window.matchMedia(`(${this.typeMedia}-width:${obj.dataAttr.size}px)`)
            this.mediaHandler(mediaQueryList, obj)
            mediaQueryList.addEventListener('change', e => this.mediaHandler(e, obj))
         }
      }
   }
   mediaHandler(e, obj) {
      if (e.matches) {
         obj.el.classList.add('-me')
         this.moveTo(obj.el, obj.dataAttr.block, obj.dataAttr.index)
      } else {
         obj.el.classList.remove('-me')
         this.moveBack(obj.el, obj.parentElement, obj.indexParent)
      }
   }
   moveTo(element, block, index) {
      if (document.querySelector(block)) {
         const toBlock = document.querySelector(block)
         const blockChildren = toBlock.children
         const indexBlock = index == 'first' ? 0 :
            index == 'last' ? undefined :
               index;

         if (blockChildren[indexBlock] != undefined) {
            blockChildren[indexBlock].insertAdjacentElement(
               'beforebegin',
               element
            )
         } else {
            toBlock.insertAdjacentElement(
               'beforeend',
               element
            )
         }
      }
   }
   moveBack(element, parentElement, index) {
      const blockChildren = parentElement.children

      if (blockChildren[index] != undefined) {
         blockChildren[index].insertAdjacentElement(
            'beforebegin',
            element
         )
      } else {
         parentElement.insertAdjacentElement(
            'beforeend',
            element
         )
      }
   }
}
const me = new Me('max')
me.init()

class MakeTab {
	constructor(el) {
		// отримання основих даних
		this.tabEl = el

		const childrenTabEl = Array.from(el.children)
		this.tabCategories = childrenTabEl.find(el => el.hasAttribute('data-tab-categories'))


		this.tabBody = childrenTabEl.find(el => el.hasAttribute('data-tab-body'))
		this.tabItems = Array.from(this.tabCategories.querySelectorAll('[data-tab-item]'))
		this.tabContents = Array.from(this.tabBody.children)

		this.mediaQuery = Array.from(el.dataset.tab.split(',')).map(text => text.trim())

		// this.animation = {
		// 	show: el.dataset.tabShowAnimation.split(',').map(text => text.trim()),
		// 	hide: el.dataset.tabHideAnimation.split(',').map(text => text.trim()),
		// }

		this.isInit = el.classList.contains('-initialized_tab')

		if (this.isInit) {
			this.activeItem = this.tabItems.find(itemEl => itemEl.classList.contains('-active'))
			this.activeContent = this.tabContents.find(contentEl => contentEl.classList.contains('-active'))
			this.activeIndex = this.tabEl.dataset.tabIndex
		}
	}

	init() {
		// створення медіа запиту
		const mediaQuery = window.matchMedia(`(${this.mediaQuery[0]}-width:${this.mediaQuery[1]}px)`)
		this.handlerMediaQuery(mediaQuery)
		mediaQuery.addListener(this.handlerMediaQuery)
	}

	// обробник медіа запиту
	handlerMediaQuery = e => {
		if (e.matches) {
			this.tabEl.classList.add('-initialized_tab')
			// знаходження активного пункту
			const activeItem = this.tabItems.find(item => item.classList.contains('-active'))
			if (!activeItem) {
				this.tabItems[0].classList.add('-active')
				this.tabContents[0].classList.add('-active')
			}

			this.activeItem = this.tabItems[0]
			this.activeContent = this.tabContents[0]

			// задання індексу блоку tab
			this.setActiveIndex(this.activeItem.dataset.tabItem)

			// приховування content
			const inActiveContents = this.tabContents.filter(el => !el.classList.contains('-active'))
			if (inActiveContents.length > 0) {
				inActiveContents.forEach(content => this.hideContent(content, false))
			}
		} else {
			// вимкнення tab
			this.tabEl.classList.remove('-initialized_tab')
			this.tabContents.forEach(content => this.showContent(content, false))
		}
	}
	// задання активного індексу головному елементі
	setActiveIndex(attrIndex) {
		this.tabEl.setAttribute('data-tab-index', attrIndex)
	}
	// приховування content
	hideContent(el, anim = true) {
		const styleEl = el.style
		if (anim) {
			// el.classList.add('-anim')
			// // styleEl.cssText = `animation:${this.animation.hide[0]} ${this.animation.hide[1]} forwards 0s;`

			// setTimeout(() => {
			// 	// styleEl.removeProperty('animation')
			// 	styleEl.display = 'none'
			// 	el.classList.remove('-anim')
			// }, duration);
		} else {
			styleEl.display = 'none'
		}
	}
	// поява content
	showContent(el, anim = true) {
		const styleEl = el.style

		if (anim) {
			// setTimeout(() => {
			// 	el.classList.add('-anim')
			// 	// styleEl.cssText = `display:block;animation:${this.animation.show[0]} ${this.animation.show[1]} forwards 0s;`
			// 	styleEl.removeProperty('display')

			// 	setTimeout(() => {
			// 		// styleEl.removeProperty('animation')
			// 		el.classList.remove('-anim')
			// 	}, duration);
			// }, duration);
		} else {
			styleEl.display = ''
		}
	}
}

const Tab = tabEl => new MakeTab(tabEl)

document.addEventListener('click', e => {
	const target = e.target

	if (target.closest('[data-tab-item]')) {
		if (Tab(target.closest('[data-tab]')).isInit) {
			e.preventDefault()

			const itemEl = target.closest('[data-tab-item]')
			if (!itemEl.classList.contains('-active') && !document.querySelector('[data-tab-content].-anim')) {
				const attrIndex = itemEl.dataset.tabItem
				const tab = Tab(target.closest('[data-tab]'))

				// задання нового активного пункту
				tab.tabItems.forEach(el => el.classList.remove('-active'))
				itemEl.classList.add('-active')

				const arrContens = tab.tabContents
				const oldActiveContent = arrContens.find(el => el.classList.contains('-active'))
				const activeContent = arrContens.find(el => el.dataset.tabContent == attrIndex)
				// задання нового активного content
				// oldActiveContent.classList.remove('-active')
				// tab.hideContent(oldActiveContent)

				// tab.showContent(activeContent)
				oldActiveContent.classList.add('-anim')
				oldActiveContent.classList.remove('-active')
				setTimeout(() => {
					oldActiveContent.style.display = 'none'
					oldActiveContent.classList.remove('-anim')

					activeContent.classList.add('-anim')
					activeContent.style.display = 'block'
					setTimeout(() => {
						activeContent.classList.add('-active')
					}, 50);
					setTimeout(() => {
						activeContent.classList.remove('-anim')
					}, duration);
				}, duration);


				// оновлення атрибуту вибраного індексу
				tab.setActiveIndex(attrIndex)
			}
		}
	}
})

const tabs = document.querySelectorAll('[data-tab]')
if (tabs.length > 0) {
	tabs.forEach(tabEl => Tab(tabEl).init())
}
class MakeCSelect {
	constructor(el) {
		this.cselectSrc = el
		this.typeSelectSrc = el.dataset.cselectSrc
		this.isInit = el.classList.contains('-initialized_cselect')
		this.hasAutoHeight = el.hasAttribute('data-cselect-auto-height')

		switch (this.typeSelectSrc) {
			case 'select':
				this.classCSelect = el.classList[0]
				// if (el.classList[1]) {
				// 	this.classCSelect = el.classList[1]
				// }
				this.classNameCSelect = el.className
				this.optionsSelect = el.options
				this.selectedIndex = this.optionsSelect.selectedIndex
				break;
			case 'block':
				this.selectedIndex = 0
				this.nameCSelect = el.dataset.cselectName
				break;
		}

		if (this.isInit) {
			this.getCSelectElements()

			if (this.typeSelectSrc == 'block') {
				this.selectedIndex = +this.cselectBlock.dataset.cselectIndex
			}
		}
	}

	getCSelectElements() {
		this.cselectBlock = this.typeSelectSrc == 'select' ? this.cselectSrc.nextElementSibling : this.cselectSrc
		this.cselectOpener = this.cselectBlock.querySelector('[data-cselect-opener]')
		this.cselectLabel = this.cselectBlock.querySelector('[data-cselect-label]')
		this.cselectIcon = this.cselectBlock.querySelector('[data-cselect-icon]')
		this.cselectBody = this.cselectBlock.querySelector('[data-cselect-body]')
		this.cselectScroll = this.cselectBlock.querySelector('[data-cselect-scroll]')
		this.cselectContent = this.cselectBlock.querySelector('[data-cselect-content]')
		this.cselectItems = this.cselectBlock.querySelectorAll('[data-cselect-item]')
	}

	init() {
		this.cselectSrc.classList.add('-initialized_cselect')
		if (this.typeSelectSrc == 'select') {
			this.createStructure()
		}

		this.getCSelectElements()
		// задання параметрів спойлера
		this.cselectBlock.classList.add('-initialized_cselect')
		this.cselectBlock.setAttribute('data-spoller', 'min,0')
		this.cselectBlock.setAttribute('data-spoller-select', '')
		this.cselectOpener.setAttribute('data-spoller-label', '')
		this.cselectOpener.setAttribute('data-spoller-opener', '')
		this.cselectBody.setAttribute('data-spoller-body', '')
		this.cselectScroll.setAttribute('data-scroll', 'vertical')

		this.hasOpenerLabel = this.cselectSrc.hasAttribute('data-cselect-opener-label')
		if (this.hasOpenerLabel) {
			this.cselectLabel.innerHTML = this.cselectSrc.dataset.cselectOpenerLabel
			this.cselectBlock.setAttribute('data-cselect-value', '')
		} else {
			this.cselectItems[this.selectedIndex].classList.add('-active')
			this.cselectLabel.innerHTML = this.optionsSelect[this.selectedIndex].text
			this.cselectBlock.setAttribute('data-cselect-index', '0')
			switch (this.typeSelectSrc) {
				case 'select':
					this.cselectLabel.innerHTML = this.optionsSelect[this.selectedIndex].text
					this.cselectBlock.setAttribute('data-cselect-value', this.optionsSelect[this.selectedIndex].text)
					break;
				case 'block':
					this.cselectBlock.setAttribute('data-cselect', '')
					this.cselectBlock.setAttribute('data-cselect-value', this.cselectItems[this.selectedIndex].innerText)

					this.cselectLabel.innerHTML = this.cselectItems[this.selectedIndex].innerText
					break;
			}
		}

		switch (this.typeSelectSrc) {
			case 'select':
				this.cselectScroll.setAttribute('data-scroll-class', this.classCSelect)
				this.cselectBlock.setAttribute('data-cselect-name', this.cselectSrc.name)
				break;
			case 'block':
				this.cselectBlock.setAttribute('data-cselect', '')

				break;
		}

		this.cselectContent.setAttribute('data-scroll-content', '')

	}


	createStructure() {
		// шаблон opener
		const templateOpenerStart = `<a href="" class="${this.classCSelect}__opener" data-cselect-opener>`
		const templateOpenerEnd = '</a>'
		const templateLabel = `<span class="${this.classCSelect}__label" data-cselect-label></span>`
		const templateIcon = `<span class="${this.classCSelect}__icon" data-cselect-icon></span>`
		const templateOpener = templateOpenerStart + templateLabel + templateIcon + templateOpenerEnd

		// шаблон body
		const templateBodyStart = `<div class="${this.classCSelect}__body" data-cselect-body>`
		const templateBodyEnd = '</div>'
		// шаблон scroll блока
		const templateScrollStart = `<div class="${this.classCSelect}__scroll" data-cselect-scroll>`
		const templateScrollEnd = '</div>'
		// шаблон content
		const templateItemsStart = `<div class="${this.classCSelect}__items" data-cselect-content>`
		const templateItemsEnd = '</div>'
		// шаблон item
		let templateOptions = ''
		for (let index = 0; index < this.optionsSelect.length; index++) {
			const option = this.optionsSelect[index]
			templateOptions += `<div class="${this.classCSelect}__item" data-cselect-item>${option.text}</div>`
		}
		const templateBody = templateBodyStart + templateScrollStart + templateItemsStart + templateOptions + templateItemsEnd + templateScrollEnd + templateBodyEnd
		// загальний шаблон
		const templateCSelectStart = `<div class="${this.classNameCSelect}" data-cselect ${this.hasAutoHeight ? 'data-cselect-auto-height' : ''}>`
		const templateCSelectEnd = '</div>'
		const templateCSelect = templateCSelectStart + templateOpener + templateBody + templateCSelectEnd
		this.cselectSrc.insertAdjacentHTML(
			'afterend',
			templateCSelect
		)
	}

	setActiveValue(activeItem) {
		// задання активного пункту
		this.cselectItems.forEach(item => item.classList.remove('-active'));
		activeItem.classList.add('-active')

		let index = Array.from(this.cselectItems).findIndex(item => item == activeItem)

		switch (this.typeSelectSrc) {
			case 'select':
				this.cselectSrc.selectedIndex = index
				break;
			case 'block':

				break;
		}
		this.cselectBlock.setAttribute('data-cselect-index', index)
		this.cselectBlock.setAttribute('data-cselect-value', activeItem.innerText)

		// зміна тексту напису
		this.cselectLabel.innerHTML = activeItem.innerText
	}
}

const CSelect = selectSrcEl => new MakeCSelect(selectSrcEl)

document.addEventListener('keydown', e => {
	// вибір пунктів списку
	if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
		if (document.querySelector('[data-spoller-select].-active') && !document.querySelector('[data-spoller-body].-anim')) {
			const activeCSelectEl = document.querySelector('[data-spoller-select].-active')
			const CSelectEl = activeCSelectEl.hasAttribute('data-cselect-src') ? activeCSelectEl : activeCSelectEl.previousElementSibling
			const cselect = CSelect(CSelectEl)
			// отриманя активного індексу
			let activeIndex = cselect.selectedIndex

			switch (e.key) {
				case 'ArrowUp':
					activeIndex -= 1
					break;
				case 'ArrowDown':
					activeIndex += 1
					break;
			}
			const activeItem = cselect.cselectItems[activeIndex]
			if (activeItem) {
				// зміна пункту
				cselect.setActiveValue(activeItem)

				// прокручування до пунктів
				const cscroll = CScroll(activeCSelectEl.querySelector('[data-scroll]'))
				const offsetTopItem = activeItem.offsetTop
				let goTo

				if (offsetTopItem < cscroll.scrollWrap.scrollTop) {
					// перехід до верхнього пункту
					goTo = offsetTopItem - cscroll.scrollWrap.scrollTop
				} else if (offsetTopItem + activeItem.offsetHeight > cscroll.scrollWrap.scrollTop + cscroll.scrollEl.offsetHeight) {
					// перехід до нижнього пункту
					goTo = (offsetTopItem + activeItem.offsetHeight) - (cscroll.scrollWrap.scrollTop + cscroll.scrollEl.offsetHeight)
				} else {
					goTo = 0
				}
				cscroll.scrollWrap.scrollBy({
					top: goTo,
					behavior: 'smooth'
				})
			}
		}
	}
})
const isMobile = {
	Android: function () { return navigator.userAgent.match(/Android/i); },
	BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); },
	iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
	Opera: function () { return navigator.userAgent.match(/Opera Mini/i); },
	Windows: function () { return navigator.userAgent.match(/IEMobile/i); },
	any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
};

function calcWidthDefaultScrollBar() {
	document.body.insertAdjacentHTML(
		'afterbegin',
		'<div class="check-width-scrollbar"><div></div></div>'
	)

	const checkScrollBarEl = document.querySelector('.check-width-scrollbar')
	const widthScrollBar = checkScrollBarEl.offsetWidth - checkScrollBarEl.querySelector('div').offsetWidth

	checkScrollBarEl.remove()
	return widthScrollBar
}

const widthDefaultScrollBar = calcWidthDefaultScrollBar();


class MakeCScroll {
	constructor(scrollEl) {
		this.scrollEl = scrollEl
		this.classScrollEl = scrollEl.hasAttribute('data-scroll-class') ? scrollEl.dataset.scrollClass : ''
		this.scrollContent = scrollEl.querySelector('[data-scroll-content]')

		this.hasArrows = scrollEl.hasAttribute('data-scroll-arrows')
		this.direction = scrollEl.dataset.scroll
		this.isDirectionAuto = this.direction == 'auto'
		this.isInit = scrollEl.classList.contains('-initialized_cscroll')
		this.isAutoHeight = scrollEl.classList.contains('-auto_height')

		this.getScrollElements()
		this.userFunction = {}
	}

	init() {
		if (!isMobile.any()) {
			// desktop
			this.scrollEl.classList.add('-' + this.direction)
			this.scrollEl.classList.add('-initialized_cscroll')
			this.isInit = true

			this.createStructure()

			this.setAutoHeight()

			// якщо різний розмір смуги прокручування 
			// for (const direction in this.scrollBars) {
			// 	const { scrollBar } = this.getScrollBarElements(direction)

			// 	this['widthScrollBar' + coords] = scrollBar[offsetSizeReverse]
			// }

			this.calcSizeScroller()
			this.scrollWrap.addEventListener('scroll', this.calcPosititonScroller)
			this.calcPosititonScroller()

		}
	}
	// отримання розміру користувацької смуги прокручування
	getWidthScrollBar() {
		const indexProperty = this.getIndexProperty(Object.keys(this.scrollBars)[0])
		const { offsetSizeReverse } = this.propertiesElement(indexProperty)

		return this.scrollBars[Object.keys(this.scrollBars)[0]].el[offsetSizeReverse]
	}
	// задання відступів для блоку прокручування
	addPadding(set, direction, allScrollBar = false) {
		const indexProperty = this.getIndexProperty(direction)
		const { paddingProperty, marginProperty } = this.propertiesElement(indexProperty)

		if (direction) {
			if (set) {
				this.scrollWrap.style['padding' + paddingProperty] = widthDefaultScrollBar + 'px'
				this.scrollContent.style['margin' + marginProperty] = widthDefaultScrollBar * (-1) + 'px'
				this.scrollContent.style['padding' + paddingProperty] = (allScrollBar ? widthDefaultScrollBar : this.getWidthScrollBar()) + 'px'
			} else {
				this.scrollWrap.style['padding' + paddingProperty] = ''
				this.scrollContent.style['padding' + paddingProperty] = ''
				this.scrollContent.style['margin' + marginProperty] = ''
			}
		}
	}
	// перевірка на автоматичну висоту
	setAutoHeight() {
		if (this.isAutoHeight) {
			const parentElement = this.scrollEl.parentElement
			if (getComputedStyle(parentElement).position == 'static') {
				parentElement.style.position = 'relative'
			}
		}
	}

	// створення структури
	createStructure() {
		const templateWrap = `<div class="${this.classScrollEl}__wrap" data-scroll-wrap></div>`
		// шаблон смуги прокручування
		let templateScrollBars = ''
		const createTemplateScrollBar = (direction) => {
			const templateScrollBarStart = `<div data-scrollbar="${direction}">`
			const templateScrollBarEnd = '</div>'
			const templateOverlay = '<div data-scrollbar-overlay></div>'
			const templateScroller = '<div data-scrollbar-scroller></div>'
			const templateBodyStart = '<div data-scrollbar-body>'
			const templateBodyEnd = '</div>'
			const templateBody = templateBodyStart + templateOverlay + templateScroller + templateBodyEnd
			// шаблони стрілок
			let templateArrows = ['', '']
			if (this.hasArrows) {
				for (let index = 0; index < templateArrows.length; index++) {
					templateArrows[index] = `<div data-scrollbar-arrow="${index ? 'down' : 'up'}"></div>`
				}
			}

			templateScrollBars += templateScrollBarStart + templateArrows[0] + templateBody + templateArrows[1] + templateScrollBarEnd
		}

		// якщо тип "auto", то буде створено дві смуги прокручування
		if (this.isDirectionAuto) {
			for (let index = 0; index < 2; index++) {
				createTemplateScrollBar(index ? 'horizontal' : 'vertical')
			}
		} else {
			createTemplateScrollBar(this.direction)
		}

		// вставлення елементів
		this.scrollEl.insertAdjacentHTML(
			'beforeend',
			templateWrap + templateScrollBars
		)

		this.getScrollElements()

		// вставлення контенту
		this.scrollWrap.insertAdjacentElement(
			'beforeend',
			this.scrollContent
		)
	}
	// обрахунок розміру бігунка
	calcSizeScroller() {
		// повернення до попереднього вигляду
		this.scrollEl.classList.remove('-only_scrollbar')
		for (const direction in this.scrollBars) {
			this.addPadding(true, direction)
			if (this.scrollBars[direction].scroller.classList.contains('-disabled')) {
				this.scrollBars[direction].scrollBar.classList.remove('-disabled')
			}
		}

		for (const direction in this.scrollBars) {
			const indexProperty = this.getIndexProperty(direction)

			const { scrollBar, scrollBarScroller } = this.getScrollBarElements(direction)
			const { propertySizeScroller } = this.propertiesElement(indexProperty)
			const { sizeScrollBarBody, sizeScrollContent, sizeScrollEl } = this.sizesElements(direction, indexProperty)

			const sizePadding = this.isDirectionAuto ? widthDefaultScrollBar : 0
			const sizeValue = sizeScrollBarBody * (sizeScrollEl / (sizeScrollContent - sizePadding))

			// задання розміру бігунка
			if (sizeValue >= sizeScrollBarBody) {
				// недопустимий розмір бігунка
				this.addPadding(false, direction)
				scrollBar.classList.add('-disabled')
				scrollBarScroller.style[propertySizeScroller] = ''
			} else {
				// допустимий розмір бігунка
				this.addPadding(true, direction)
				scrollBar.classList.remove('-disabled')

				scrollBarScroller.style[propertySizeScroller] = sizeValue + 'px'
			}
		}
		// відбір вимкнених смуг прокручування
		let scrollBarDisabled = 0
		for (const direction in this.scrollBars) {
			if (this.scrollBars[direction].el.classList.contains('-disabled')) {
				scrollBarDisabled++
			}
		}

		// якщо є тільки одна смуга прокручування
		if (scrollBarDisabled > 0) {
			this.scrollEl.classList.add('-only_scrollbar')
			if (scrollBarDisabled == Object.keys(this.scrollBars).length) {
				for (const direction in this.scrollBars) {
					this.addPadding(true, direction, true)
				}
			}
		}
	}
	// обрахунок позиції бігунка
	calcPosititonScroller = (e) => {
		if (!this.isMovedScroller()) {
			for (const direction in this.scrollBars) {
				const indexProperty = this.getIndexProperty(direction)

				const { propertiesAbsolutePoz, valueScrolled } = this.propertiesElement(indexProperty)
				const { sizeScroller, sizeScrollBarBody, sizeScrollContent, sizeScrollEl } = this.sizesElements(direction, indexProperty)
				const { scrollBarScroller } = this.getScrollBarElements(direction)

				// задання позиції бігунка при прокручуванні
				scrollBarScroller.style[propertiesAbsolutePoz] = (sizeScrollBarBody - sizeScroller) * (valueScrolled / (sizeScrollContent - sizeScrollEl)) + 'px'
			}
		}
		// користувацька функція onScroll
		if (e && e.type == 'scroll' && this.userFunction.onScroll) {
			this.userFunction.onScroll()
		}
	}

	// перевіряє чи прокручується блок за допомогою бігунка
	isMovedScroller() {
		let isMoved = false

		for (const direction in this.scrollBars) {
			if (this.scrollBars[direction].scroller.classList.contains('-moved')) {
				isMoved = true
			}
		}

		return isMoved
	}
	// визначення індексу в залежності від напрямку
	getIndexProperty(direction) {
		let indexProperty;

		switch (direction) {
			case 'vertical':
				indexProperty = 0
				break;
			case 'horizontal':
				indexProperty = 1
				break;
		}

		return indexProperty
	}
	// отримати елементи data-scroll
	getScrollElements() {
		this.scrollWrap = this.scrollEl.querySelector('[data-scroll-wrap]')
		this.scrollBars = {}
		// отримання смуг прокрутки
		const scrollBarsEl = Array.from(this.scrollEl.children).filter(el => el.hasAttribute('data-scrollbar'))

		scrollBarsEl.forEach(el => {
			const direction = el.dataset.scrollbar

			this.scrollBars[direction] = {
				el,
				body: el.querySelector('[data-scrollbar-body]'),
				overlay: el.querySelector('[data-scrollbar-overlay]'),
				scroller: el.querySelector('[data-scrollbar-scroller]'),
			}

			const objScrollBar = this.scrollBars[direction]
			if (this.hasArrows) {
				objScrollBar.arrows = el.querySelectorAll('[data-scrollbar-arrow]')
				objScrollBar.arrowUp = el.querySelector('[data-scrollbar-arrow-up]')
				objScrollBar.arrowDown = el.querySelector('[data-scrollbar-arrow-down]')
			}
		})
	}
	// отримати елементи scrollbar
	getScrollBarElements(param) {
		let activeDirection = param

		if (typeof param !== 'string') {
			activeDirection = param.closest('[data-scrollbar]').dataset.scrollbar
		}

		const objScrollBar = this.scrollBars[activeDirection]

		return {
			activeDirection,
			scrollBar: objScrollBar.el,
			scrollBarBody: objScrollBar.body,
			scrollBarOverlay: objScrollBar.overlay,
			scrollBarScroller: objScrollBar.scroller,
			scrollBarArrows: objScrollBar.arrows,
			scrollBarArrowUp: objScrollBar.arrowUp,
			scrollBarArrowDown: objScrollBar.arrowDown,
		}
	}
	// отримання об'єкту властивостей
	propertiesElement(indexProperty, params = {}) {
		const obj = {
			offsetSize: ['offsetHeight', 'offsetWidth'][indexProperty],
			offsetSizeReverse: ['offsetWidth', "offsetHeight"][indexProperty],
			propertiesAbsolutePoz: ['top', 'left'][indexProperty],
			propertySizeScroller: ['height', 'width'][indexProperty],
			propertyValueScrolled: ['scrollTop', 'scrollLeft'][indexProperty],

			paddingProperty: ['Right', "Bottom"][indexProperty],
			marginProperty: ['Right', "Bottom"][indexProperty],

			coords: ['Vertical', 'Horizontal'][indexProperty],
		}

		for (const key in params) {
			if (params.hasOwnProperty('coordsMouse')) {
				obj.coordsMouse = params.coordsMouse[indexProperty]
			}
		}

		obj.valueScrolled = this.scrollWrap[obj.propertyValueScrolled] // значення прокрученого

		return obj
	}
	// отримання об'єкту розмірів елементів data-scroll
	sizesElements(direction, indexProperty, paramCoordsMouse = {}) {
		const { offsetSize, propertiesAbsolutePoz, propertySizeScroller, coordsMouse } = this.propertiesElement(indexProperty, paramCoordsMouse)
		const { scrollBarBody, scrollBarScroller } = this.getScrollBarElements(direction)

		const obj = {
			sizeScrollEl: this.scrollEl[offsetSize], // розмір головного блоку
			sizeScrollContent: this.scrollContent[offsetSize], // розмір контенту
			sizeScrollBarBody: scrollBarBody[offsetSize], // розмір тіла scrollbar
			pozScrollBarBody: scrollBarBody.getBoundingClientRect()[propertiesAbsolutePoz], // позиція тіла scrollbar
			sizeScroller: Math.round(scrollBarScroller.getBoundingClientRect()[propertySizeScroller]), // розмір бігунка
			pozScrollBarScroller: scrollBarScroller.getBoundingClientRect()[propertiesAbsolutePoz], // позиція бігунка
			partSizeScroller: scrollBarScroller[offsetSize] / 2, // половина розміру бігунка
		}

		if (coordsMouse) {
			obj.areaScrollBarBody = coordsMouse - scrollBarBody.getBoundingClientRect()[propertiesAbsolutePoz] // область між позицією курсору і початком тіла scrollbar
		}

		return obj
	}
	// переміщення бігунка
	moveScroller(scroller, x, y) {
		this.getScrollElements()

		const { activeDirection, scrollBarScroller } = this.getScrollBarElements(scroller)
		const indexProperty = this.getIndexProperty(activeDirection)

		const paramCoordsMouse = { coordsMouse: [y, x] }
		const { propertiesAbsolutePoz, coordsMouse } = this.propertiesElement(indexProperty, paramCoordsMouse)
		const { sizeScroller, areaScrollBarBody, sizeScrollBarBody, sizeScrollContent, pozScrollBarScroller, sizeScrollEl } = this.sizesElements(activeDirection, indexProperty, paramCoordsMouse)

		// задання позиції курсору
		if (!scrollBarScroller.hasOwnProperty('pozMouse')) {
			scrollBarScroller.pozMouse = coordsMouse - pozScrollBarScroller
		}

		const pozMouse = scroller.pozMouse
		let pozScroller = areaScrollBarBody - pozMouse // позиція бігунка

		if (Math.sign(pozScroller) >= 0) {
			// зупинка переміщення бігунка
			if (Math.sign(areaScrollBarBody - (sizeScrollBarBody - (sizeScroller - pozMouse))) >= 0) {
				pozScroller -= areaScrollBarBody - (sizeScrollBarBody - (sizeScroller - pozMouse))
			}

			scrollBarScroller.style[propertiesAbsolutePoz] = pozScroller + 'px'

			// прокручування блоку
			const procentScrolling = pozScroller / (sizeScrollBarBody - sizeScroller)
			const goTo = Math.round((sizeScrollContent - sizeScrollEl) * procentScrolling)
			const goToX = indexProperty ? goTo : this.scrollWrap.scrollLeft
			const goToY = indexProperty ? this.scrollWrap.scrollTop : goTo

			this.scrollWrap.scrollTo(goToX, goToY)
		}

	}

	// прокручення до
	movedTo(overlayEl, x, y) {
		this.getScrollElements()

		const { activeDirection } = this.getScrollBarElements(overlayEl)
		const indexProperty = this.getIndexProperty(activeDirection)

		const paramCoordsMouse = { coordsMouse: [y, x] }
		const { coordsMouse, propertiesAbsolutePoz } = this.propertiesElement(indexProperty, paramCoordsMouse)
		const { sizeScroller, sizeScrollBarBody, sizeScrollContent, sizeScrollEl, pozScrollBarBody, partSizeScroller } = this.sizesElements(activeDirection, indexProperty, paramCoordsMouse)

		let goTo;
		if (coordsMouse - partSizeScroller < pozScrollBarBody) {
			// позиція бігунка менша за розмір тіла scrollbar
			goTo = 0
		} else if (coordsMouse + partSizeScroller > pozScrollBarBody + sizeScrollBarBody) {
			// позиція бігунка більша за розмір тіла scrollbar
			goTo = sizeScrollContent - sizeScrollEl
		} else {
			// бігунок в центрі
			const pozScroller = coordsMouse - partSizeScroller - pozScrollBarBody
			const procentScrolling = pozScroller / (sizeScrollBarBody - sizeScroller)

			goTo = Math.round((sizeScrollContent - sizeScrollEl) * procentScrolling)
		}

		// прокручування блоку
		this.scrollWrap.scrollTo({
			[propertiesAbsolutePoz]: goTo,
			behavior: 'smooth'
		})
	}
	// прокручення за допомогою стрілок
	movedArrow(arrowEl) {
		this.getScrollElements()

		const { activeDirection } = this.getScrollBarElements(arrowEl)
		const indexProperty = this.getIndexProperty(activeDirection)

		const { propertiesAbsolutePoz, valueScrolled } = this.propertiesElement(indexProperty)
		const { sizeScrollContent, sizeScrollEl } = this.sizesElements(activeDirection, indexProperty)

		const step = 40; // крок прокручування
		let newValueScrolled;
		let indexArrow;
		// визначення типу стрілки
		switch (arrowEl.dataset.scrollbarArrow) {
			case 'up':
				newValueScrolled = valueScrolled - step
				indexArrow = 0
				break;
			case 'down':
				newValueScrolled = valueScrolled + sizeScrollEl + step
				indexArrow = 1
				break;
		}

		let goTo;

		if (newValueScrolled < 0) {
			// позиція менша за діапазон прокручування
			goTo = valueScrolled * (-1)
		} else if (newValueScrolled > sizeScrollContent) {
			// позиція більша за діапазон прокручування
			goTo = sizeScrollContent - (valueScrolled + sizeScrollEl)
		} else {
			// позиція в центрі
			goTo = indexArrow ? step : step * (-1)
		}

		// прокручування блоку
		this.scrollWrap.scrollBy({
			[propertiesAbsolutePoz]: goTo,
			behavior: 'smooth',
		})
	}
	// тривале натискання на стрілку
	longPressArrow(arrowEl) {
		this.getScrollElements()

		const { activeDirection } = this.getScrollBarElements(arrowEl)
		const indexProperty = this.getIndexProperty(activeDirection)

		const { propertiesAbsolutePoz, valueScrolled } = this.propertiesElement(indexProperty)
		const { sizeScrollContent, sizeScroller, sizeScrollEl, sizeScrollBarBody, pozScrollBarBody, pozScrollBarScroller } = this.sizesElements(activeDirection, indexProperty)

		let step;
		let indexArrow;

		switch (arrowEl.dataset.scrollbarArrow) {
			case 'up':
				step = -25
				indexArrow = 0
				break;
			case 'down':
				step = 25
				indexArrow = 1
				break;
		}

		let goTo;

		if (pozScrollBarScroller - pozScrollBarBody + step < 0) {
			// позиція менша за діапазон прокручування
			goTo = valueScrolled * (-1)
		} else if (pozScrollBarScroller - pozScrollBarBody + sizeScroller + step > sizeScrollBarBody) {
			// позиція більша за діапазон прокручування
			goTo = (sizeScrollContent - sizeScrollEl) - valueScrolled
		} else {
			// позиція в центрі
			const procentScrolling = step / (sizeScrollBarBody - sizeScroller)

			goTo = Math.round((sizeScrollContent - sizeScrollEl) * procentScrolling)
		}

		this.scrollWrap.scrollBy({
			[propertiesAbsolutePoz]: goTo,
			behavior: 'smooth',
		})
		// продоження виконання, якщо є тривале натиснення
		if (arrowEl.classList.contains('-press_long')) {
			arrowEl.timeout = setTimeout(() => {
				this.longPressArrow(arrowEl)
			}, 100);
		}
	}

	// оновлення data-scroll
	update() {
		this.getScrollElements()

		this.calcSizeScroller()
		this.calcPosititonScroller()
	}
	// реєстрація користувацьких подій
	on(type, userFunction) {
		const events = ['scroll']

		if (typeof type == 'string' && events.includes(type) && typeof userFunction == 'function') {
			const nameFunction = 'on' + type[0].toUpperCase() + type.slice(1)
			this.userFunction[nameFunction] = userFunction
		}
	}
}

const CScroll = scrollEl => new MakeCScroll(scrollEl)

document.onmousedown = e => {
	const target = e.target

	if (target.closest('[data-scrollbar-scroller]')) {
		const scroller = target.closest('[data-scrollbar-scroller]')

		scroller.classList.add('-moved')
		CScroll(scroller.closest('[data-scroll]')).moveScroller(scroller, e.clientX, e.clientY)
		return false
	}

	if (target.closest('[data-scrollbar-overlay]')) {
		const scrollBarOverlay = target.closest('[data-scrollbar-overlay]')

		CScroll(scrollBarOverlay.closest('[data-scroll]')).movedTo(scrollBarOverlay, e.clientX, e.clientY)
		return false
	}

	if (target.closest('[data-scrollbar-arrow]')) {
		const scrollBarArrow = target.closest('[data-scrollbar-arrow]')
		const cscrollBlock = CScroll(scrollBarArrow.closest('[data-scroll]'))

		scrollBarArrow.classList.add('-press')
		cscrollBlock.movedArrow(scrollBarArrow)

		scrollBarArrow.timeout = setTimeout(() => {
			scrollBarArrow.classList.add('-press_long')
			cscrollBlock.longPressArrow(scrollBarArrow)
		}, 350);

		return false
	}
}

document.addEventListener('mousemove', e => {
	if (document.querySelector('[data-scrollbar-scroller].-moved')) {
		const scroller = document.querySelector('[data-scrollbar-scroller].-moved')
		CScroll(scroller.closest('[data-scroll]')).moveScroller(scroller, e.clientX, e.clientY)
	}
})

document.addEventListener('mouseup', e => {
	if (document.querySelector('[data-scrollbar-scroller].-moved')) {
		const scroller = document.querySelector('[data-scrollbar-scroller].-moved')

		scroller.classList.remove('-moved')
		delete scroller.pozMouse
	}

	if (document.querySelector('[data-scrollbar-arrow].-press')) {
		const arrowEl = document.querySelector('[data-scrollbar-arrow].-press')

		arrowEl.classList.remove('-press')
		clearTimeout(arrowEl.timeout)
	}
})

// const scrollElements = document.querySelectorAll('[data-scroll]')
// if (scrollElements.length > 0) {
// 	scrollElements.forEach(scrollEl => CScroll(scrollEl).init())
// }

window.addEventListener('resize', () => {
	// оновлення CScroll
	const scrollElements = document.querySelectorAll('[data-scroll]')
	if (scrollElements.length > 0) {
		scrollElements.forEach(scrollEl => CScroll(scrollEl).update())
	}
})

class MakeSpoller {
	constructor(el) {
		// отримання основих даних
		this.spollerEl = el
		this.spollerLabel = Array.from(el.children).find(el => el.hasAttribute('data-spoller-label'))
		this.spollerOpener = this.spollerLabel.hasAttribute('data-spoller-opener') ? this.spollerLabel : this.spollerLabel.querySelector('[data-spoller-opener]')
		this.spollerBody = Array.from(el.children).find(el => el.hasAttribute('data-spoller-body'))
		this.isSpollerSelect = el.hasAttribute('data-spoller-select')

		if (el.closest('[data-spollers]')) {
			this.groupEl = el.closest('[data-spollers]')
		}

		const attrValue = this.groupEl ? this.groupEl.dataset.spollers : el.dataset.spoller
		this.mediaQuery = Array.from(attrValue.split(',')).map(text => text.trim())

		if (this.groupEl && this.groupEl.hasAttribute('data-spollers-one')) {
			this.oneSpoller = true
		}

		this.isInit = el.classList.contains('-initialized-spoller')
		this.isOpen = el.classList.contains('-active')
	}

	init() {
		// створення медіа запиту
		const mediaQuery = window.matchMedia(`(${this.mediaQuery[0]}-width:${this.mediaQuery[1]}px)`)
		this.handlerMediaQuery(mediaQuery)
		mediaQuery.addListener(this.handlerMediaQuery)
	}

	hideSpoller(anim = true) {
		this.spollerEl.classList.remove('-active')
		slideUp(this.spollerBody, anim)
		if (this.isSpollerSelect) {
			// видалення z-index
			setTimeout(() => {
				this.spollerEl.classList.remove('-add_z-index')
			}, duration);
		}
	}

	showSpoller(anim = true) {
		this.spollerEl.classList.add('-active')
		slideDown(this.spollerBody, anim)
		if (this.isSpollerSelect) {
			// задання z-index
			this.spollerEl.classList.add('-add_z-index')
			setTimeout(() => {
				CScroll(this.spollerBody).update()
			}, duration);
			// оновлення scroll після відкриття спойлера
			setTimeout(() => {
				CScroll(this.spollerBody).update()
			}, duration);
		}
	}

	toggleSpoller() {
		if (this.isOpen) {
			this.hideSpoller()
		} else {
			// перевірка чи має спойлер "один відкритий" і в групі є відкритий спойлер
			if (this.oneSpoller && this.groupEl.querySelector('[data-spoller].-active')) {
				const oldSpollerEl = this.groupEl.querySelector('[data-spoller].-active')
				Spoller(oldSpollerEl).hideSpoller()
				oldSpollerEl.classList.remove('-active')
			}

			this.showSpoller()
		}
	}

	// обробник медіа запиту
	handlerMediaQuery = e => {
		if (e.matches) {
			this.spollerEl.classList.add('-initialized-spoller')
			if (!this.isOpen) {
				this.hideSpoller(false)
			}
		} else {
			this.spollerEl.classList.remove('-initialized-spoller')
			this.showSpoller(false)
		}
	}
}

const Spoller = spollerEl => new MakeSpoller(spollerEl)

document.addEventListener('click', e => {
	const target = e.target

	if (target.closest('[data-spoller-opener]')) {
		const spollerEl = target.closest('[data-spoller]')
		const spoller = Spoller(spollerEl)

		if (spoller.isInit) {
			e.preventDefault()
			if (!document.querySelector('[data-spoller-body].-anim')) {
				// закриття відкритого списку
				if (document.querySelector('[data-spoller-select].-active')) {
					const openCSelect = document.querySelector('[data-spoller-select].-active')
					if (openCSelect != spollerEl) {
						Spoller(openCSelect).hideSpoller()
					}
				}
				// відкриття списку
				spoller.toggleSpoller()
			}
		}
	}
	if (!target.closest('[data-spoller]')) {
		// закриття списку, якщо натиснуто на пусте місце
		if (document.querySelector('[data-spoller-select].-active') && !document.querySelector('[data-spoller-body].-anim')) {
			Spoller(document.querySelector('[data-spoller-select].-active')).hideSpoller()
		}
	}
	if (target.closest('[data-cselect-item]') && !document.querySelector('[data-spoller-body].-anim')) {
		// зміна пункту
		const cselectBlock = target.closest('[data-cselect]')
		const CSelectEl = cselectBlock.hasAttribute('data-cselect-src') ? cselectBlock : cselectBlock.previousElementSibling
		CSelect(CSelectEl).setActiveValue(target.closest('[data-cselect-item]'))

		// закриття спойлера
		const spoller = Spoller(cselectBlock)
		if (spoller.isOpen) {
			spoller.hideSpoller()
		}
	}
})

// const spollers = document.querySelectorAll('[data-spoller]')
// if (spollers.length > 0) {
// 	spollers.forEach(spoller => Spoller(spoller).init())
// }
class MakeValidateForm {
    constructor(classEl, userFunc) {
        const form = document.querySelector('.' + classEl)

        if (form) {
            this.form = form
            this.formClass = form.classList[0]
            this.userFunc = userFunc
            this.isFormEl = form.tagName === 'FORM' ? true : false


            if (!this.isFormEl) {
                this.btnSubmit = form.querySelector('[data-form-submit]')
            }
        }
    }

    init() {
        if (this.form) {
            if (this.isFormEl) {
                this.form.addEventListener('submit', this.submit)
            } else {
                this.submit()
            }
        }
    }

    submit = (e = null) => {
        if (this.isFormEl) {
            e.preventDefault()
        }

        this.validate()

        if (this.errors === 0) {
            const formData = new FormData()

            for (const prop in this.elements) {
                const formElements = this.elements[prop];

                switch (prop) {
                    case 'input':
                        for (let index = 0; index < formElements.length; index++) {
                            const input = formElements[index];
                            formData.append(input.name, input.value.trim())
                        }
                        break
                    case 'checkbox':
                        const arrCheckboxs = {}
                        for (let index = 0; index < formElements.length; index++) {
                            const inputCheckbox = formElements[index];
                            if (arrCheckboxs[inputCheckbox.name]) {
                                arrCheckboxs[inputCheckbox.name].push(inputCheckbox)
                            } else {
                                arrCheckboxs[inputCheckbox.name] = [inputCheckbox]
                            }
                        }
                        for (const nameGroupCheckbox in arrCheckboxs) {
                            const groupCheckbox = arrCheckboxs[nameGroupCheckbox];
                            const valuesCheckbox = []
                            groupCheckbox.forEach(checkbox => {
                                if (checkbox.checked) {
                                    valuesCheckbox.push(checkbox.value)
                                }
                            })
                            formData.append(nameGroupCheckbox, valuesCheckbox.join(','))
                        }

                        break
                    case 'select':
                        for (let index = 0; index < formElements.length; index++) {
                            const select = formElements[index];
                            formData.append(select.dataset.cselectName, select.dataset.cselectValue)
                        }
                        break
                }
            }

            this.userFunc({
                isFormEl: this.isFormEl,
                form: this.form,
                formElements: this.elements,
                btnSubmit: this.btnSubmit,
                formData,
            })
        }
    }

    validate() {
        this.elements = {}
        if (this.form.querySelectorAll('input.-req').length > 0) {
            this.elements.input = []
            for (let index = 0; index < this.form.querySelectorAll('input.-req').length; index++) {
                const input = this.form.querySelectorAll('input.-req')[index];

                if (input.closest('[data-form]') == this.form) {
                    if (!this.elements.input) {
                        this.elements.input = []
                    }
                    this.elements.input.push(input)
                }
            }
        }
        if (this.form.querySelectorAll('input[type="checkbox"].-req').length > 0) {
            this.elements.checkbox = []

            for (let index = 0; index < this.form.querySelectorAll('input[type="checkbox"].-req').length; index++) {
                const checkbox = this.form.querySelectorAll('input[type="checkbox"].-req')[index];

                if (checkbox.closest('[data-form]') == this.form) {
                    if (!this.elements.checkbox) {
                        this.elements.checkbox = []
                    }
                    this.elements.checkbox.push(checkbox)
                }
            }
        }
        if (this.form.querySelectorAll('[data-cselect]').length > 0) {
            for (let index = 0; index < this.form.querySelectorAll('[data-cselect]').length; index++) {
                const select = this.form.querySelectorAll('[data-cselect]')[index];

                if (select.closest('[data-form]') == this.form) {
                    if (!this.elements.select) {
                        this.elements.select = []
                    }
                    this.elements.select.push(select)
                }
            }
        }

        this.errors = 0

        for (const prop in this.elements) {
            const formElements = this.elements[prop];

            switch (prop) {
                case 'input':
                    for (let index = 0; index < formElements.length; index++) {
                        const input = formElements[index];

                        this.removeError(input, prop)

                        if (!input.disabled) {
                            if (input.classList.contains('-text')) {
                                if (input.value == '') {
                                    this.addError(input, prop)
                                }
                            }
                            if (input.classList.contains('-number')) {
                                const minValue = input.min ? +input.min : 1

                                if (input.value == '') {
                                    this.addError(input, prop)
                                } else if (this.isNumber(input.value)) {
                                    this.addError(input, prop)
                                } else if (+input.value < minValue) {
                                    this.addError(input, prop)
                                } else {
                                    if (input.max) {
                                        if (+input.value > +input.max) {
                                            this.addError(input, prop)
                                        }
                                    }
                                }
                            }
                            if (input.classList.contains('-tel')) {
                                if (this.isTel(input.value)) {
                                    this.addError(input, prop)
                                }
                            }
                            if (input.classList.contains('-email')) {
                                if (this.isEmail(input.value)) {
                                    this.addError(input, prop)
                                }
                            }
                            if (input.classList.contains('-password')) {
                                if (this.isPassword(input.value)) {
                                    this.addError(input, prop)
                                }
                            }
                        }
                    }
                    break;
                case 'select':
                    for (let index = 0; index < formElements.length; index++) {
                        const select = formElements[index];

                        this.removeError(select)
                        if (!select.hasAttribute('data-cselect-index')) {
                            this.addError(select)
                        }
                    }
                    break;
                // case 'checkbox':
                //     for (let index = 0; index < formElements.length; index++) {
                //         const checkbox = formElements[index];

                //         this.removeError(checkbox)
                //         if (checkbox.classList.contains('-one-select')) {
                //             console.log(checkbox);
                //             const nameGroupCheckbox = checkbox.name.substring(0, checkbox.name.search('-'))
                //             console.log(document.querySelector(`[name=${nameGroupCheckbox}-*]`));


                //         }
                //     }
                //     break;

            }
        }
        const groupsCheckbox = {}
        for (const prop in this.elements.checkbox) {
            const checkbox = this.elements.checkbox[prop];

            if (checkbox.classList.contains('-one-select')) {
                const nameGroupCheckbox = checkbox.name.substring(0, checkbox.name.search('-'))
                if (checkbox.name.includes(nameGroupCheckbox)) {
                    if (!groupsCheckbox[nameGroupCheckbox]) {
                        groupsCheckbox[nameGroupCheckbox] = []
                    }
                    groupsCheckbox[nameGroupCheckbox].push(checkbox)
                }
            }
        }
        for (const key in groupsCheckbox) {
            const groupCheckbox = groupsCheckbox[key];

            const hasCheckedCheckbox = groupCheckbox.find(checkbox => checkbox.checked == true)
            if (!hasCheckedCheckbox) {
                for (let index = 0; index < groupCheckbox.length; index++) {
                    const checkbox = groupCheckbox[index];
                    this.addError(checkbox)
                }
            }

        }

    }
    isNumber(value) {
        return !/^\d+$/.test(value)
    }
    isEmail(value) {
        return !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
    }
    isTel(value) {
        return !/^[\+]?3?[\s]?8?[\s]?\(?0\d{2}?\)?[\s]?\d{3}[\s|-]?\d{2}[\s|-]?\d{2}$/g.test(value)
    }
    isPassword(value) {
        return !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/.test(value)

    }
    addError(el, type) {
        el.classList.add('-error')
        if (type == 'input') {
            el.parentElement.classList.add('-error')
        }
        this.errors++
    }
    removeError(el, type) {
        el.classList.remove('-error')
        if (type == 'input') {
            el.parentElement.classList.remove('-error')
        }
    }
}

const ValidateForm = (form, func) => new MakeValidateForm(form, func)


class MakeInputPlaceholder {
    constructor(input) {
        this.input = input
        this.dataValue = input.dataset.value
        this.isInit = input.classList.contains('-handler-placeholder')
    }

    init() {
        if (!this.isInit) {
            this.input.classList.add('-handler-placeholder')
            this.input.placeholder = this.dataValue
            this.input.addEventListener('focus', this.focusInput)
            this.input.addEventListener('blur', this.blurInput)
        }
    }

    focusInput = () => {
        this.input.placeholder = ''
    }

    blurInput = () => {
        if (this.input.value.length == 0) {
            this.input.placeholder = this.dataValue
        }
    }

    update() {
        if (this.isInit) {
            this.input.placeholder = this.dataValue
        }
    }
}

const InputPlaceholder = (input) => new MakeInputPlaceholder(input)
document.addEventListener('DOMContentLoaded', () => {
    // select
    const selectSrcElements = document.querySelectorAll('[data-cselect-src]')
    if (selectSrcElements.length > 0) {
        selectSrcElements.forEach(selectSrcEl => CSelect(selectSrcEl).init())
    }
    // scroll
    const scrollElements = document.querySelectorAll('[data-scroll]')
    if (scrollElements.length > 0) {
        scrollElements.forEach(scrollEl => CScroll(scrollEl).init())
    }
    // spoller
    const spollers = document.querySelectorAll('[data-spoller]')
    if (spollers.length > 0) {
        spollers.forEach(spoller => Spoller(spoller).init())
    }
    // запуск обробників для полів введення
    const inputsPlaceholder = document.querySelectorAll('[data-value]')
    if (inputsPlaceholder.length > 0) {
        inputsPlaceholder.forEach(input => InputPlaceholder(input).init())
    }
})

const copyContent = async (text, funcSuccess, funcError) => {
    try {
        await navigator.clipboard.writeText(text);
        if (funcSuccess) funcSuccess()
    } catch (err) {
        console.error('Failed to copy: ', err);
        if (funcError) funcError()
    }
}

document.addEventListener('click', e => {
    const target = e.target

    if (target.closest('.menu-burger')) {
        e.preventDefault()

        const btnMenuBurder = target.closest('.menu-burger')
        const menuBlock = document.querySelector('.menu')

        if (btnMenuBurder.classList.contains('-active')) {
            btnMenuBurder.classList.remove('-active')
            menuBlock.classList.remove('-open')
            document.body.classList.remove('-lock')
        } else {
            btnMenuBurder.classList.add('-active')
            menuBlock.classList.add('-open')
            document.body.classList.add('-lock')
        }
    }
    if (target.closest('.connect-code__item')) {
        e.preventDefault()
        const connectCodeItemEl = target.closest('.connect-code__item')
        const connectCodeTextEl = connectCodeItemEl.querySelector('.connect-code__text')

        copyContent(connectCodeTextEl.innerHTML,
            () => {
                connectCodeItemEl.classList.add('-success-copy')
                setTimeout(() => {
                    connectCodeItemEl.classList.remove('-success-copy')
                }, 1500);
            },
            () => {
                connectCodeItemEl.classList.add('-error-copy')
                setTimeout(() => {
                    connectCodeItemEl.classList.remove('-error-copy')
                }, 1500);
            },
        )

    }
    if (target.closest('.tabs-schedule-item__btn')) {
        e.preventDefault()
        // isFormEl, formElements, formData, btnSubmit
        ValidateForm('tabs-schedule-item__settings-break', ({ isFormEl, formElements, formData, btnSubmit, }) => {
            console.log(formElements);

        }).init()
    }
})


if (document.querySelector('.slider-choose-category-student__body')) {
    const sliderChooseCategoryStudent = document.querySelector('.slider-choose-category-student__body')

    new Swiper(sliderChooseCategoryStudent, {
        navigation: {
            prevEl: sliderChooseCategoryStudent.parentElement.querySelector('.-slider-arrow_prev'),
            nextEl: sliderChooseCategoryStudent.parentElement.querySelector('.-slider-arrow_next'),
        },
        simulateTouch: true,
        grabCursor: true,
        watchOverflow: true,
        slidesPerView: 'auto',
        //slidesPerGroup: 1,
        breakpoints: {
            0: {
                spaceBetween: 15,
            },
            575.98: {
                spaceBetween: 20,

            },
        }
    })
}
if (document.querySelector('.slider-choose-lesson-student__body')) {
    const sliderChooseLessonStudent = document.querySelector('.slider-choose-lesson-student__body')

    new Swiper(sliderChooseLessonStudent, {
        navigation: {
            prevEl: sliderChooseLessonStudent.parentElement.querySelector('.-slider-arrow_prev'),
            nextEl: sliderChooseLessonStudent.parentElement.querySelector('.-slider-arrow_next'),
        },
        simulateTouch: true,
        grabCursor: true,
        watchOverflow: true,
        slidesPerView: 'auto',
        //slidesPerGroup: 1,
        breakpoints: {
            0: {
                spaceBetween: 15,
            },
            575.98: {
                spaceBetween: 20,

            },
        }
    })
}
if (document.querySelector('.schedule-item__slider-body')) {
    const slider = new Swiper('.schedule-item__slider-body', {
        navigation: {
            prevEl: '.schedule-item__slider-arrow_prev',
            nextEl: '.schedule-item__slider-arrow_next',
        },
        simulateTouch: true,
        grabCursor: true,
        watchOverflow: false,
        slidesPerView: 'auto',
        spaceBetween: 10,
        // slidesPerGroup: 1,
        //breakpoints: {
        //0: {},
        //}
    })
}
if (document.querySelector('.advert__slider-body')) {
    const slider = new Swiper('.advert__slider-body', {
        navigation: {
            prevEl: '.advert__slider-arrow_prev',
            nextEl: '.advert__slider-arrow_next',
        },
        simulateTouch: true,
        grabCursor: true,
        watchOverflow: false,
        breakpoints: {
            0: {
                spaceBetween: 20,
                slidesPerView: 1,
            },
            991.98: {
                spaceBetween: 20,
                slidesPerView: 'auto',
            },
            1399.98: {
                slidesPerView: 'auto',
                spaceBetween: 30,
            },
        }
    })
}
if (document.querySelector('.schedule-general-info__slider-body')) {
    new Swiper('.schedule-general-info__slider-body', {
        simulateTouch: false,
        watchOverflow: false,
        slidesPerView: 'auto',
        scrollbar: {
            el: ".schedule-general-info__slider-scrollbar",
            draggable: true
        },
        // freeMode: true,
        //slidesPerGroup: 1,
        nested: true,
        breakpoints: {
            0: {
                spaceBetween: 20,
            },
            767.98: {
                spaceBetween: 30,
            },
        },
    })
}
if (document.querySelector('.tabs-schedule-item__slider-body_items') && document.querySelector('.tabs-schedule-item__slider-body_content')) {

    const contentSlider = new Swiper('.tabs-schedule-item__slider-body_content', {
        simulateTouch: false,
        watchOverflow: false,
        nested: true,
        spaceBetween: 20,
        //slidesPerView: 1,
        //slidesPerGroup: 1,
        //spaceBetween: 24,
        //breakpoints: {
        //0: {},
        //}
    })
    const thumbsSlider = new Swiper('.tabs-schedule-item__slider-body_items', {
        navigation: {
            prevEl: '.tabs-schedule-item__slider-arrow_prev',
            nextEl: '.tabs-schedule-item__slider-arrow_next',
        },
        simulateTouch: true,
        grabCursor: true,
        watchOverflow: false,
        //slidesPerView: 1,
        //slidesPerGroup: 1,
        nested: true,
        spaceBetween: 20,
        controller: {
            control: contentSlider
        }
        //breakpoints: {
        //0: {},
        //}
    })

}
if (document.querySelector('.preview-break-schedule-item__body')) {
    const slider = new Swiper('.preview-break-schedule-item__body', {
        scrollbar: {
            el: ".preview-break-schedule-item__slider-scrollbar",
            draggable: true
        },
        simulateTouch: false,
        watchOverflow: false,
        slidesPerView: 'auto',
        spaceBetween: 10,
        //slidesPerGroup: 1,
        //breakpoints: {
        //0: {},
        //}
    })
}
if (document.querySelector('.schedule-teacher__slider-body')) {
    new Swiper('.schedule-teacher__slider-body', {

        navigation: {
            prevEl: '.schedule-teacher__slider-arrow_prev',
            nextEl: '.schedule-teacher__slider-arrow_next',
        },
        simulateTouch: false,
        watchOverflow: false,
        spaceBetween: 20,
        //slidesPerGroup: 1,
        breakpoints: {
            0: {
                slidesPerView: 1.1,
            },
            575.98: {
                slidesPerView: 1.4,
            },
            991.98: {
                slidesPerView: 2,
            },
            1399.98: {
                slidesPerView: 2,
            },
            1639.98: {
                slidesPerView: 4,
            },
        }
    })
}
if (document.querySelector('.schedule-groups__slider-body_tabs')) {
    new Swiper('.schedule-groups__slider-body_tabs', {
        navigation: {
            prevEl: '.schedule-groups__slider-arrow_prev',
            nextEl: '.schedule-groups__slider-arrow_next',
        },
        nested: true,
        simulateTouch: false,
        watchOverflow: false,
        //slidesPerView: 1,
        //slidesPerGroup: 1,
        //breakpoints: {
        //0: {},
        //}
    })
}
if (document.querySelector('.schedule-groups-form__slider-body')) {
    new Swiper('.schedule-groups-form__slider-body', {
        navigation: {
            prevEl: '.schedule-groups-form__slider-arrow_prev',
            nextEl: '.schedule-groups-form__slider-arrow_next',
        },
        simulateTouch: true,
        grabCursor: true,
        watchOverflow: false,
        //slidesPerView: 1,
        //slidesPerGroup: 1,
        //spaceBetween: 24,
        //breakpoints: {
        //0: {},
        //}
        spaceBetween: 20,
    })
}

// isFormEl, formElements, formData, btnSubmit
ValidateForm('account-form_reg-1', ({ isFormEl, formElements, formData, btnSubmit, }) => {
    for (let [name, value] of formData) {
        console.log(`${name} = ${value}`);
    }
}).init()
ValidateForm('account-form_reg-2', ({ isFormEl, formElements, formData, btnSubmit, }) => {
    for (let [name, value] of formData) {
        console.log(`${name} = ${value}`);
    }
}).init()
ValidateForm('account-form_reg-3', ({ isFormEl, formElements, formData, btnSubmit, }) => {
    for (let [name, value] of formData) {
        console.log(`${name} = ${value}`);
    }
}).init()
ValidateForm('account-form_login', ({ isFormEl, formElements, formData, btnSubmit, }) => {
    for (let [name, value] of formData) {
        console.log(`${name} = ${value}`);
    }
}).init()
// isFormEl, formElements, formData, btnSubmit
ValidateForm('schedule-general-info__schedule-item[data-form]', ({ isFormEl, formElements, formData, btnSubmit, }) => {
    console.log(formElements);

}).init()
