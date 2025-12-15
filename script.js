// Flower shop website JavaScript
console.log("Flower shop website is loading...");

// Global variables
let currentRating = 0;
let allReviews = [];
let currentFilter = 'all';

// Heart rating system functions

// Initialize heart rating
function initHeartRating() {
    const hearts = document.querySelectorAll('.heart');
    
    hearts.forEach(heart => {
        const value = parseInt(heart.getAttribute('data-value'));
        
        // Click on heart
        heart.addEventListener('click', function() {
            setRating(value);
        });
        
        // Mouse over heart
        heart.addEventListener('mouseover', function() {
            highlightHearts(value);
        });
        
        // Mouse out of hearts
        heart.addEventListener('mouseout', function() {
            resetHeartDisplay();
        });
    });
}

// Set rating
function setRating(value) {
    currentRating = value;
    document.getElementById('ratingValue').value = value;
    
    // Update hearts display
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach(heart => {
        const heartValue = parseInt(heart.getAttribute('data-value'));
        if (heartValue <= value) {
            heart.classList.add('active');
        } else {
            heart.classList.remove('active');
        }
    });
    
    // Update rating text
    const ratingText = document.getElementById('ratingText');
    const texts = [
        "Not rated yet",
        "Poor",
        "Fair",
        "Good",
        "Very Good",
        "Excellent"
    ];
    ratingText.textContent = texts[value];
}

// Highlight hearts on hover
function highlightHearts(value) {
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach(heart => {
        const heartValue = parseInt(heart.getAttribute('data-value'));
        if (heartValue <= value) {
            heart.classList.add('hover');
        } else {
            heart.classList.remove('hover');
        }
    });
}

// Reset heart display
function resetHeartDisplay() {
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach(heart => {
        heart.classList.remove('hover');
        const heartValue = parseInt(heart.getAttribute('data-value'));
        if (heartValue <= currentRating) {
            heart.classList.add('active');
        } else {
            heart.classList.remove('active');
        }
    });
}

// Create stars HTML for display
function createStarsHTML(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '🖤';
        } else {
            stars += '🤍';
        }
    }
    return stars;
}

// Get color based on rating
function getRatingColor(rating) {
    const colors = [
        "#888888", // 0
        "#ff6b6b", // 1
        "#ffa500", // 2
        "#ffd166", // 3
        "#06d6a0", // 4
        "#118ab2"  // 5
    ];
    return colors[rating] || colors[0];
}

// Reviews system functions

// Load reviews function
function loadReviews() {
    console.log("Loading reviews...");
    
    // Get reviews from browser memory
    const savedReviews = localStorage.getItem('flowerReviews');
    
    // If there are saved reviews
    if (savedReviews) {
        try {
            allReviews = JSON.parse(savedReviews);
            initFilters();
            applyFilter('all');
        } catch (error) {
            console.log("Error loading reviews:", error);
            showEmptyReviews();
        }
    } else {
        // If no reviews
        allReviews = [];
        initFilters();
        showEmptyReviews();
    }
}

// Initialize filter buttons
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Apply filter
            applyFilter(category);
        });
    });
}

// Apply filter to reviews
function applyFilter(category) {
    currentFilter = category;
    let filteredReviews;
    
    if (category === 'all') {
        filteredReviews = allReviews;
    } else {
        filteredReviews = allReviews.filter(review => 
            review.category && review.category === category
        );
    }
    
    // Show filtered reviews
    showReviews(filteredReviews);
    
    // Update counter
    updateReviewsCounter(filteredReviews.length);
}

// Update reviews counter
function updateReviewsCounter(count) {
    let counter = document.getElementById('reviewsCounter');
    
    if (!counter) {
        counter = document.createElement('div');
        counter.id = 'reviewsCounter';
        counter.className = 'reviews-counter';
        
        const reviewsListBox = document.querySelector('.reviews-list-box');
        const allReviewsContainer = document.getElementById('allReviews');
        
        if (reviewsListBox && allReviewsContainer) {
            reviewsListBox.insertBefore(counter, allReviewsContainer);
        }
    }
    
    let filterText = '';
    if (currentFilter !== 'all') {
        filterText = ` (filtered by: ${currentFilter})`;
    }
    
    counter.textContent = `Showing ${count} review${count !== 1 ? 's' : ''}${filterText}`;
}

// Show reviews on page using appendChild
function showReviews(reviews) {
    const container = document.getElementById('allReviews');
    
    if (!container) {
        console.log("Reviews container not found!");
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // If no reviews
    if (reviews.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.style.cssText = 'background: #000000ff; padding: 20px; color: white; text-align: center;';
        const emptyText = document.createElement('p');
        emptyText.style.color = '#888';
        
        if (currentFilter === 'all') {
            emptyText.textContent = 'No reviews yet. Be the first!';
        } else {
            emptyText.textContent = `No reviews in category "${currentFilter}". Try another filter.`;
        }
        
        emptyMsg.appendChild(emptyText);
        container.appendChild(emptyMsg);
        return;
    }
    
    // Create HTML for each review using appendChild
    reviews.forEach(function(review, index) {
        // Find the original index in allReviews array
        const originalIndex = allReviews.findIndex(r => 
            r.name === review.name && 
            r.text === review.text && 
            r.date === review.date
        );
        
        const displayIndex = originalIndex !== -1 ? originalIndex : index;
        
        const card = document.createElement('div');
        card.className = 'review-card';
        
        // Create author element
        const author = document.createElement('div');
        author.className = 'review-author';
        author.textContent = review.name || 'Anonymous';
        card.appendChild(author);
        
        // Create date element
        const date = document.createElement('div');
        date.className = 'review-date';
        date.textContent = review.date || 'Today';
        card.appendChild(date);
        
        // Create category element if exists
        if (review.category) {
            const category = document.createElement('div');
            category.className = 'review-category';
            category.textContent = `Category: ${review.category}`;
            card.appendChild(category);
        }
        
        // Create rating element if exists
        if (review.rating && review.rating > 0) {
            const ratingDiv = document.createElement('div');
            ratingDiv.className = 'review-rating';
            
            const starsSpan = document.createElement('span');
            starsSpan.style.color = getRatingColor(review.rating);
            starsSpan.textContent = createStarsHTML(review.rating);
            
            const ratingValue = document.createElement('span');
            ratingValue.className = 'rating-value';
            ratingValue.textContent = `${review.rating}/5`;
            
            ratingDiv.appendChild(starsSpan);
            ratingDiv.appendChild(ratingValue);
            card.appendChild(ratingDiv);
        }
        
        // Create review text element
        const content = document.createElement('div');
        content.className = 'review-content';
        content.textContent = review.text || 'No text';
        card.appendChild(content);
        
        // Create photo element if exists
        if (review.photo) {
            const photo = document.createElement('img');
            photo.src = review.photo;
            photo.alt = 'Bouquet';
            photo.className = 'review-photo';
            photo.onclick = function() {
                showFullPhoto(review.photo);
            };
            card.appendChild(photo);
        }
        
        // Create buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = 'display: flex; align-items: center; margin-top: 10px;';
        
        // Create like button
        const likeButton = document.createElement('button');
        likeButton.className = 'like-button';
        likeButton.id = `like-btn-${displayIndex}`;
        const likes = review.likes || 0;
        likeButton.innerHTML = likes > 0 ? `🖤 ${likes}` : '🖤 0';
        likeButton.onclick = function() {
            addLike(displayIndex);
        };
        
        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            deleteReview(displayIndex);
        };
        
        // Append buttons to container
        buttonsContainer.appendChild(likeButton);
        buttonsContainer.appendChild(deleteButton);
        
        // Append buttons container to card
        card.appendChild(buttonsContainer);
        
        // Append card to container
        container.appendChild(card);
    });
    
    console.log("Showing reviews:", reviews.length);
}

// Show full photo
function showFullPhoto(photoSrc) {
    // Create modal for full photo
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 2000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const fullImg = document.createElement('img');
    fullImg.src = photoSrc;
    fullImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
    `;
    
    modal.appendChild(fullImg);
    
    // Close on click
    modal.onclick = function() {
        document.body.removeChild(modal);
    };
    
    document.body.appendChild(modal);
}

// Show empty message
function showEmptyReviews() {
    const container = document.getElementById('allReviews');
    if (container) {
        // Clear container
        container.innerHTML = '';
        
        // Create message element
        const emptyMsg = document.createElement('div');
        emptyMsg.style.cssText = 'background: #000000ff; padding: 20px; color: white; text-align: center;';
        
        const emptyText = document.createElement('p');
        emptyText.style.color = '#888';
        emptyText.textContent = 'No reviews yet. Be the first to write a review!';
        
        emptyMsg.appendChild(emptyText);
        container.appendChild(emptyMsg);
    }
}

// Add new review
function addReview() {
    console.log("Adding new review...");
    
    // Get form data
    const name = document.getElementById('reviewName').value;
    const text = document.getElementById('reviewText').value;
    const rating = currentRating;
    const category = document.getElementById('productCategory').value;
    const photoInput = document.getElementById('reviewPhoto');
    
    // Check required fields
    if (!name || !text) {
        alert("Please fill in name and review text!");
        return;
    }
    
    // Check if rating is selected
    if (rating === 0) {
        if (!confirm("You didn't select a rating. Submit review without rating?")) {
            return;
        }
    }
    
    // Create review object
    const newReview = {
        name: name,
        text: text,
        rating: rating,
        category: category || 'Not specified',
        date: new Date().toLocaleDateString('ru-RU'),
        likes: 0
    };
    
    // Process photo if exists
    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            newReview.photo = event.target.result;
            saveReview(newReview);
        };
        
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        saveReview(newReview);
    }
}

// Save review to localStorage
function saveReview(newReview) {
    // Get old reviews
    allReviews = JSON.parse(localStorage.getItem('flowerReviews')) || [];
    
    // Add new review to beginning
    allReviews.unshift(newReview);
    
    // Save to browser memory
    localStorage.setItem('flowerReviews', JSON.stringify(allReviews));
    
    // Apply current filter to show updated list
    applyFilter(currentFilter);
    
    // Clear form and reset rating
    clearForm();
    setRating(0);
    
    // Show message
    alert("Thank you for your review! It has been published.");
    console.log("Review added successfully");
}

// Clear form
function clearForm() {
    document.getElementById('reviewName').value = '';
    document.getElementById('reviewText').value = '';
    document.getElementById('productCategory').value = '';
    document.getElementById('reviewPhoto').value = '';
    const preview = document.getElementById('photoPreview');
    if (preview) {
        preview.innerHTML = 'No photo selected';
        preview.style.color = '#888';
    }
    setRating(0);
    console.log("Form cleared");
}

// Add like to review
function addLike(reviewIndex) {
    console.log("Adding like to review", reviewIndex);
    
    if (allReviews[reviewIndex]) {
        // Increase like count
        allReviews[reviewIndex].likes = (allReviews[reviewIndex].likes || 0) + 1;
        
        // Save back
        localStorage.setItem('flowerReviews', JSON.stringify(allReviews));
        
        // Apply current filter to update display
        applyFilter(currentFilter);
        
        // Change button
        const btn = document.getElementById(`like-btn-${reviewIndex}`);
        if (btn) {
            btn.innerHTML = `🖤 ${allReviews[reviewIndex].likes}`;
            btn.classList.add('active');
            
            // Remove active class after 1 second
            setTimeout(() => {
                btn.classList.remove('active');
            }, 1000);
        }
    }
}

// Delete review
function deleteReview(reviewIndex) {
    if (confirm("Are you sure you want to delete this review?")) {
        // Remove review by index
        allReviews.splice(reviewIndex, 1);
        
        // Save back
        localStorage.setItem('flowerReviews', JSON.stringify(allReviews));
        
        // Apply current filter to update display
        applyFilter(currentFilter);
        
        console.log("Review deleted");
        alert("Review deleted!");
    }
}

// Show photo preview
function showPhotoPreview(input) {
    const preview = document.getElementById('photoPreview');
    if (!preview) return;
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Clear preview
            preview.innerHTML = '';
            
            // Create image element
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.cssText = 'max-width: 150px; max-height: 100px; border-radius: 5px; margin-top: 5px;';
            
            // Create file name text
            const fileName = document.createElement('div');
            fileName.textContent = input.files[0].name;
            fileName.style.cssText = 'color: #000; font-size: 12px; margin-top: 5px;';
            
            // Append elements to preview
            preview.appendChild(img);
            preview.appendChild(fileName);
        };
        
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.innerHTML = 'No photo selected';
        preview.style.color = '#888';
    }
}

// When page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page fully loaded!");
    
    // Load reviews
    loadReviews();
    
    // Initialize heart rating
    initHeartRating();
    
    // Assign functions to buttons
    const submitBtn = document.getElementById('submitReview');
    const clearBtn = document.getElementById('clearForm');
    const photoInput = document.getElementById('reviewPhoto');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', addReview);
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearForm);
    }
    
    if (photoInput) {
        photoInput.addEventListener('change', function() {
            showPhotoPreview(this);
        });
    }
});