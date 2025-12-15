// Mock Data for Posts
const posts = [
    {
        id: 1,
        forum: "感情",
        forumId: "mood",
        forumIcon: "https://picsum.photos/seed/mood/20",
        title: "台GG上班真的好可怕",
        excerpt: "我老公是一位 GG 的小工程師。年薪加分紅大約兩百萬，收入其實不差，但工時真的非常長。幾乎每週一到五都是早八出、晚八回，偶爾還要六日輪值...",
        author: "Anonymous",
        time: "Yesterday 18:25",
        likes: "1K",
        comments: "359",
        bookmarks: "521",
        image: null,
        content: `我老公是一位 GG 的小工程師。

年薪加分紅大約兩百萬，收入其實不差，但工時真的非常長。
幾乎每週一到五都是早八出、晚八回，偶爾還要六日輪值。下班回家後，他常常直接在沙發上睡著，不洗澡、不回房間；週末幾乎整天都在補眠，沒辦法幫忙做家務，也沒有多餘的心力玩遊戲或出門走走。

他唯一還有力氣做的，大概只剩下擼貓（我們有兩隻親人的傻貓）。
看他身邊的學長姊，甚至部長，工時一個比一個長，70 ~ 80 小時是常態。那種感覺就是：這樣的生活不但不會慢慢變好，反而像是一條看不到盡頭的路。而多數已經成家的同事，幾乎都是靠「家庭小精靈」在撐。

有時候我會覺得，自己慢慢活成了我媽那一代的職業婦女。

<img src="https://picsum.photos/seed/sheep/400/300" alt="struggle">

我下班後負責整理家裡、餵貓、煮飯、洗碗、倒垃圾；等他回家，再收拾他吃完的飯，不論是外賣、還是我煮的。
而我自己，其實也是外科醫師，薪水差不多，也不是不能理解值班與加班的痛苦。剛畢業時...`
    },
    {
        id: 2,
        forum: "感情",
        forumId: "mood",
        forumIcon: "https://picsum.photos/seed/mood/20",
        title: "去完男友的大學廢忽然想退婚了",
        excerpt: "更：只要不吃！沒想到會有大家的回音，感謝各大網友們的建議，先滿這篇文 本人決定要退婚了 超...",
        author: "Anonymous",
        time: "18h",
        likes: "959",
        comments: "557",
        bookmarks: "469",
        image: null,
        content: "詳細內文..."
    },
    {
        id: 3,
        forum: "淡江大學",
        forumId: "tku",
        forumIcon: "https://picsum.photos/seed/tku/20",
        title: "淡江大學好玩嗎？",
        excerpt: "我是大一新生，想問問看學長姐們淡江有什麼好吃的，還是有什麼社團推薦參加的嗎？希望可以過個充...",
        author: "國立淡水大學",
        time: "18h",
        likes: "1.1K",
        comments: "95",
        bookmarks: "126",
        image: "https://picsum.photos/seed/tku-view/100/100",
        content: "如題，求解！！！"
    },
    {
        id: 4,
        forum: "研究所",
        forumId: "grad",
        forumIcon: "https://picsum.photos/seed/grad/20",
        title: "碩班的各位都還好嗎？",
        excerpt: "其實剛進實驗室的時候是滿開心的，覺得所有人都很好相處，也很慶幸自己能夠進到這樣的環境，雖然...",
        author: "國立臺灣大學",
        time: "19h",
        likes: "489",
        comments: "60",
        bookmarks: "120",
        image: null,
        content: "真的好累..."
    },
    {
        id: 5,
        forum: "My Wall",
        forumId: "wall",
        forumIcon: "https://picsum.photos/seed/wall/20",
        title: "【我ㄉ令人打開開心房的特質？】詳細解析24h內發文",
        excerpt: "詳細解析24h內發文💡，哈囉我是E大大呀～自己自私的招牌占卜師。偶爾會分享很多家裡的私微...",
        author: "E大大的魔幻/無名氏",
        time: "14h",
        likes: "100",
        comments: "3",
        bookmarks: "3",
        image: "https://picsum.photos/seed/tarot/100/100",
        content: "占卜結果請見圖片..."
    },
    {
        id: 6,
        forum: "研究所",
        forumId: "grad",
        forumIcon: "https://picsum.photos/seed/grad/20",
        title: "建議大家 有頂大選頂大",
        excerpt: "132年學測可能只有5萬人報考（除以2），如果頂大照現在這個樣子招下去，到時候人均台清交成",
        author: "國立陽明交通大學",
        time: "2h",
        likes: "20",
        comments: "11",
        bookmarks: "7",
        image: "https://picsum.photos/seed/stats/100/100",
        content: "數據如下圖所示..."
    }
];

// Mock Data for Comments
const comments = [
    {
        postId: 1,
        floor: "B1",
        school: "國立臺灣大學",
        content: "真的很辛苦，加油！",
        likes: 12
    },
    {
        postId: 1,
        floor: "B2",
        school: "淡江大學",
        content: "感同身受...",
        likes: 5
    },
    {
        postId: 1,
        floor: "B3",
        school: "國立清華大學",
        content: "這就是園區的日常啊，錢是用肝換來的。",
        likes: 24
    }
];

// State
let currentFilter = 'all'; // 'all' or 'following' or specific forumId
let currentActivePostId = null;

// Functions
function renderFeed(filterType = 'all') {
    currentFilter = filterType;
    const container = document.getElementById('postsContainer');
    container.innerHTML = ''; // Clear existing

    // Show Feed View, Hide Detail View
    document.getElementById('feedView').classList.remove('hidden');
    document.getElementById('detailView').classList.add('hidden');
    document.getElementById('mainContent').scrollTo(0, 0);

    // Update Tabs UI
    if (filterType === 'all' || filterType === 'following') {
        document.querySelector('.tabs').classList.remove('hidden');
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        if (filterType === 'all') document.getElementById('tabAll').classList.add('active');
        if (filterType === 'following') document.getElementById('tabFollowing').classList.add('active');
    } else {
        // Hide tabs if viewing specific forum
        document.querySelector('.tabs').classList.add('hidden');
    }

    // Update Sidebar Active State (Simple Implementation)
    document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));

    // Filter Logic
    let displayPosts = [];
    if (filterType === 'all') {
        displayPosts = posts;
    } else if (filterType === 'following') {
        // Hardcoded following list: Mood, TKU, Grad
        const following = ['mood', 'tku', 'grad'];
        displayPosts = posts.filter(p => following.includes(p.forumId));
    } else {
        // Specific Forum
        displayPosts = posts.filter(p => p.forumId === filterType);
    }

    // Render Posts
    displayPosts.forEach(post => {
        const hasImage = post.image ? `<img src="${post.image}" class="post-thumbnail">` : '';
        const excerptWidth = post.image ? 'calc(100% - 100px)' : '100%';

        const cardHTML = `
            <div class="post-card" onclick="openPost(${post.id})">
                <div class="post-header">
                    <div class="forum-info">
                        <img src="${post.forumIcon}" class="forum-avatar">
                        ${post.forum}
                    </div>
                    <span>•</span>
                    <div class="post-meta" style="margin-left: 8px;">
                        ${post.author} • ${post.time}
                    </div>
                </div>
                <div class="post-body">
                    <div class="post-text" style="width: ${excerptWidth}">
                        <div class="post-title">${post.title}</div>
                        <div class="post-excerpt">${post.excerpt}</div>
                    </div>
                    ${hasImage}
                </div>
                <div class="post-footer">
                    <div class="interaction-item">
                        <i class="fa-regular fa-heart"></i> ${post.likes}
                    </div>
                    <div class="interaction-item">
                        <i class="fa-regular fa-comment"></i> ${post.comments}
                    </div>
                    <div class="interaction-item">
                         <i class="fa-regular fa-bookmark"></i> ${post.bookmarks}
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

function openPost(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Toggle Views
    document.getElementById('feedView').classList.add('hidden');
    document.getElementById('detailView').classList.remove('hidden');
    window.scrollTo(0, 0);

    // Fill Data
    document.getElementById('detailForumIcon').src = post.forumIcon;
    document.getElementById('detailForumName').innerText = post.forum;

    document.getElementById('detailAuthorAvatar').src = `https://picsum.photos/seed/${post.author}/40`; // Random avatar seed
    document.getElementById('detailAuthorName').innerText = post.author;
    document.getElementById('detailTime').innerText = post.time;

    document.getElementById('detailTitle').innerText = post.title;
    document.getElementById('detailBody').innerHTML = post.content;


    // Set active post
    currentActivePostId = postId;

    // Render Comments
    renderComments();
}

function renderComments() {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';

    // Filter comments for current post
    const postComments = comments.filter(c => c.postId === currentActivePostId);

    postComments.forEach(c => {
        commentsList.innerHTML += `
             <div class="comment">
                <div class="author-avatar" style="background-color: #ddd;"></div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="school">${c.school}</span>
                        <span class="floor">${c.floor}</span>
                    </div>
                    <div>${c.content}</div>
                    <div style="margin-top: 8px; color: #aaa; font-size: 12px;">
                        <i class="fa-regular fa-heart"></i> ${c.likes}
                    </div>
                </div>
            </div>
        `;
    });
}

// Handle New Comment
function submitComment() {
    const input = document.getElementById('commentInput');
    const content = input.value.trim();
    if (!content) return;

    if (!currentActivePostId) return;

    // Filter existing comments for this post to calculate floor
    const existingComments = comments.filter(c => c.postId === currentActivePostId);
    const newFloor = "B" + (existingComments.length + 1);

    const newComment = {
        postId: currentActivePostId,
        floor: newFloor,
        school: "與會嘉賓", // Default user name for guest
        content: content,
        likes: 0
    };

    comments.push(newComment);

    // Refresh comments list
    renderComments();

    // Increment comment count in posts array (optional but good for consistency UI)
    const post = posts.find(p => p.id === currentActivePostId);
    if (post) {
        post.comments = parseInt(post.comments || 0) + 1;
    }

    // Clear input
    input.value = '';
}

function showFeed() {
    document.getElementById('feedView').classList.remove('hidden');
    document.getElementById('detailView').classList.add('hidden');
}

function switchTab(tab) {
    renderFeed(tab);
}

function renderForum(forumId) {
    renderFeed(forumId);
}

// Initial Render
// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    renderFeed('all');

    // Attach Enter key listener for comments
    const commentInput = document.getElementById('commentInput');
    if (commentInput) {
        commentInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                submitComment();
            }
        });
    }
});
