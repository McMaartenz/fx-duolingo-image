const DuoImgSearchExt = (() => {
	const imageApi = 'https://loremflickr.com/320/240/';

	const getDOM = () => {
		return document.querySelector('div[data-test="challenge challenge-translate"]');
	};

	const getText = () => {
		return document.querySelector('div[dir]').lastChild.innerText;
	};

	const inject = () => {
		const div = document.createElement('div');
		
		Object.assign(div.style, {
			width: '337px',
			height: '100%',
			gridColumn: 2,
			display: 'flex',
			flexDirection: 'column',
			gap: '10px',
			overflowY: 'scroll',
			maxHeight: '600px',
			borderRadius: '10px',
			overflowX: 'hidden',
			scrollbarWidth: 'thin',
		});

		var css = `
		div[duo-img] {
			opacity: 1;
		}
		div[duo-img]:hover {
			opacity: 0;
			z-index: -1;
		}
		iframe:hover {
			z-index:99!important;
		}
		`;

		var style = document.createElement('style');

		if (style.styleSheet) {
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}

		div.setAttribute('duo-img-search','');
		const dom = getDOM();
		if (dom === null) {
			setTimeout(inject, 4000);
			console.log('[DuoImg]: Trying to reinject..');
			return;
		}

		dom.appendChild(style);

		Object.assign(dom.style, {
			gridTemplateColumns: 'max-content',
			gridColumnGap: '2%',
		});

		console.log('[DuoImg]: Injecting..');
		dom.appendChild(div);
		addListener();
		update();
	};

	const selectElement = () => {
		return document.querySelector('div[duo-img-search]');
	};

	const selectOrInject = () => {
		const el = selectElement();
		if (el === null) {
			inject();
		}

		return selectElement();
	};

	const getWords = () => {
		return getText()
			.split(' ')
			.map(word => word.replace(/[.,;:!?]$/g, ''));
	};

	const createImg = (word) => {
		const entry = document.createElement('div');
		Object.assign(entry.style, {
			position: 'relative',
			minHeight: '240px',
		});

		const card = document.createElement('iframe');
		card.src = `https://en.m.wiktionary.org/wiki/${word}`;

		Object.assign(card.style, {
			position: 'absolute',
			left: '0',
			border: 'none',
			width: '320px',
			height: '100%',
			borderRadius: '10px',
		});

		const img = document.createElement('div');
		img.innerText = word;
		img.setAttribute('duo-img','');

		Object.assign(img.style, {
			textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'end',
			background: `url(${imageApi}${word})`,
			backgroundSize: 'contain',
			backgroundRepeat: 'no-repeat',
			aspectRatio: '1.33 / 1',
			borderRadius: '10px',
			minWidth: '320px',
			color: 'white',
			position: 'absolute',
		});

		entry.appendChild(card);
		entry.appendChild(img);
		return entry;
	}

	const getButton = () => {
		return document.querySelector('[data-test=player-next]');
	}

	const addListener = () => {
		const button = getButton();
		const updater = () => {
			try {
				setTimeout(update, 500);
			}
			catch (e) {
				console.log('[DuoImg]: Failure during update: ' + e);
				updater();
			}
		};
		
		button.addEventListener('click', updater);
	}

	const update = () => {
		const imgs = selectOrInject();
		imgs.innerHTML = '';

		console.log('[DuoImg]: Updating..');

		const words = getWords();
		console.log('[DuoImg]: Rendering for words: ' + words);
		for (const word of words) {
			imgs.appendChild(
				createImg(word)
			);
		}
	};

	const addCheck = () => {
		console.log('[DuoImg]: Checking if still there..');
		selectOrInject();
		setTimeout(addCheck, 2000);
	}

	const init = () => {
		inject();
		addCheck();
	};

	return {
		init
	};
})().init();
