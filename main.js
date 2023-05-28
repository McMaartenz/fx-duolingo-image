const DuoImgSearchExt = (() => {
	const getDOM = () => {
		return document.querySelector('div[data-test="challenge challenge-translate"]');
	};

	const getText = () => {
		return document.querySelector('div[dir]').lastChild.innerText;
	};

	const inject = () => {
		const div = document.createElement('div');
		
		Object.assign(div.style, {
			width: '100%',
			height: '100%',
			gridColumn: 2,
			display: 'flex',
			flexDirection: 'column',
			gap: '10px',
			overflowY: 'scroll',
			maxHeight: '600px',
			borderRadius: '10px',
		});

		div.setAttribute('duo-img-search','');

		const dom = getDOM();
		if (dom === null) {
			setTimeout(inject, 2000);
			console.log('[DuoImg]: Trying to reinject..');
			return;
		}

		Object.assign(dom.style, {
			gridTemplateColumns: 'max-content',
			gridColumnGap: '2%',
		});

		dom.appendChild(div);
		addListener();
	};

	const selectElement = () => {
		return document.querySelector('div[duo-img-search]');
	};

	const selectOrInject = () => {
		const el = selectElement();
		if (el === null) {
			console.log('[DuoImg]: Injecting..');
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
		const img = document.createElement('div');
		img.innerText = word;

		Object.assign(img.style, {
			textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'end',
			background: `url(https://loremflickr.com/320/240/${word})`,
			backgroundSize: 'contain',
			backgroundRepeat: 'no-repeat',
			aspectRatio: '1.33 / 1',
			borderRadius: '10px',
			minWidth: '320px',
		  });

		return img;
	}

	const addListener = () => {
		const button = document.querySelector('[data-test=player-next]');
		
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
		for (const word of getWords()) {
			imgs.appendChild(
				createImg(word)
			);
		}
	};

	const init = () => {
		update();
		addListener();
	};

	return {
		init
	};
})().init();
