document.addEventListener('DOMContentLoaded', () => {

    // ── State ──────────────────────────────────────────────────────
    let state = {
        search: '',
        gender: 'All',
        religion: 'All',
        origin: 'All',
        rashi: 'All',
        alpha: 'All',
    };

    // ── DOM Refs ───────────────────────────────────────────────────
    const searchInput      = document.getElementById('searchInput');
    const filterGender     = document.getElementById('filterGender');
    const filterReligion   = document.getElementById('filterReligion');
    const filterOrigin     = document.getElementById('filterOrigin');
    const filterRashi      = document.getElementById('filterRashi');
    const findNamesBtn     = document.getElementById('findNamesBtn');
    const clearFiltersBtn  = document.getElementById('clearFiltersBtn');
    const alphabetRow      = document.getElementById('alphabetRow');
    const namesList        = document.getElementById('namesList');
    const noResults        = document.getElementById('noResults');
    const resultsCount     = document.getElementById('resultsCount');
    const popularGirls     = document.getElementById('popularGirls');
    const popularBoys      = document.getElementById('popularBoys');

    // ── Build A-Z Row ──────────────────────────────────────────────
    const buildAlphabet = () => {
        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i);
            const btn = document.createElement('button');
            btn.className = 'alpha-btn';
            btn.textContent = letter;
            btn.dataset.letter = letter;
            alphabetRow.appendChild(btn);
        }

        alphabetRow.addEventListener('click', e => {
            const btn = e.target.closest('.alpha-btn');
            if (!btn) return;
            document.querySelectorAll('.alpha-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.alpha = btn.dataset.letter;
            render();
        });
    };

    // ── Gender Icon Buttons ────────────────────────────────────────
    document.querySelectorAll('.gender-icon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.gender-icon-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.gender = btn.dataset.gender;
            // Also sync the dropdown
            filterGender.value = state.gender;
            render();
        });
    });

    // ── FIND NAMES button ──────────────────────────────────────────
    findNamesBtn.addEventListener('click', () => {
        state.gender   = filterGender.value;
        state.religion = filterReligion.value;
        state.origin   = filterOrigin.value;
        state.rashi    = filterRashi.value;
        // Sync gender icon buttons
        document.querySelectorAll('.gender-icon-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.gender === state.gender);
        });
        render();
    });

    // ── Search ─────────────────────────────────────────────────────
    searchInput.addEventListener('input', () => {
        state.search = searchInput.value.trim().toLowerCase();
        render();
    });

    // ── Clear All ──────────────────────────────────────────────────
    clearFiltersBtn.addEventListener('click', () => {
        state = { search: '', gender: 'All', religion: 'All', origin: 'All', rashi: 'All', alpha: 'All' };
        searchInput.value = '';
        filterGender.value = 'All';
        filterReligion.value = 'All';
        filterOrigin.value = 'All';
        filterRashi.value = 'All';
        document.querySelectorAll('.alpha-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.gender-icon-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.gender === 'All');
        });
        render();
    });

    // ── Filter Logic ───────────────────────────────────────────────
    const applyFilters = () => {
        return babyNamesData.filter(n => {

            if (state.search) {
                const q = state.search;
                if (!n.name.toLowerCase().includes(q) && !n.meaning.toLowerCase().includes(q)) return false;
            }

            if (state.gender !== 'All' && n.gender !== state.gender) return false;
            if (state.religion !== 'All' && n.religion !== state.religion) return false;
            if (state.origin !== 'All' && n.origin !== state.origin) return false;
            if (state.rashi !== 'All' && n.rashi !== state.rashi) return false;
            if (state.alpha !== 'All' && n.startingLetter !== state.alpha) return false;

            return true;
        }).sort((a, b) => a.name.localeCompare(b.name));
    };

    // ── Render Name Row ────────────────────────────────────────────
    const createNameRow = (n) => {
        const row = document.createElement('div');
        row.className = 'name-row';

        const genderLetter = n.gender === 'Boy' ? '♂' : n.gender === 'Girl' ? '♀' : '⚥';
        const bubbleClass  = n.gender === 'Boy' ? 'bubble-boy' : n.gender === 'Girl' ? 'bubble-girl' : 'bubble-unisex';

        row.innerHTML = `
            <div class="name-gender-bubble ${bubbleClass}">${genderLetter}</div>
            <div class="name-info">
                <div class="name-title">${n.name}</div>
                <div class="name-meaning">${n.meaning}</div>
            </div>
            <div class="name-tags">
                <span class="name-tag">${n.religion}</span>
                <span class="name-tag">${n.origin}</span>
                ${n.rashi ? `<span class="name-tag">${n.rashi}</span>` : ''}
            </div>
            <button class="name-like-btn" title="Save name" aria-label="Like ${n.name}">♡</button>
        `;

        // Toggle heart / like
        const likeBtn = row.querySelector('.name-like-btn');
        likeBtn.addEventListener('click', () => {
            const liked = likeBtn.classList.toggle('liked');
            likeBtn.textContent = liked ? '♥' : '♡';
        });

        return row;
    };

    // ── Master Render ──────────────────────────────────────────────
    const render = () => {
        const filtered = applyFilters();

        namesList.innerHTML = '';

        if (filtered.length === 0) {
            namesList.classList.add('hidden');
            noResults.classList.remove('hidden');
            resultsCount.textContent = '0 names found';
            return;
        }

        namesList.classList.remove('hidden');
        noResults.classList.add('hidden');
        resultsCount.textContent = `${filtered.length} name${filtered.length > 1 ? 's' : ''} found`;

        const fragment = document.createDocumentFragment();
        filtered.forEach(n => fragment.appendChild(createNameRow(n)));
        namesList.appendChild(fragment);
    };

    // ── Popular Names Section ──────────────────────────────────────
    const buildPopular = () => {
        const girls = babyNamesData.filter(n => n.gender === 'Girl').slice(0, 8);
        const boys  = babyNamesData.filter(n => n.gender === 'Boy').slice(0, 8);

        girls.forEach(n => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#">♀ ${n.name}</a>`;
            popularGirls.appendChild(li);
        });

        boys.forEach(n => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#">♂ ${n.name}</a>`;
            popularBoys.appendChild(li);
        });
    };

    // ── Init ───────────────────────────────────────────────────────
    buildAlphabet();
    buildPopular();
    babyNamesData.sort((a, b) => a.name.localeCompare(b.name));
    render();
});
