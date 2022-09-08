$(document).ready(function() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const all_pair_count = urlParams.get('cards')/2;
    const allowd_visible_cards_no = 2;

    let card_flips = 0

    var visible_cards_count = 0;
    var shown_pair_count = 0;

    const visible_class = 'visible';
    const not_visible_class = 'not-visible';  
    const not_pressable_class = 'not-pressable';

    const images_sources = ["bear.png", "camel.png", "chicken.png", "crocodile.png", "duck.png", "eagle.png", "fish.jpg", "flamingo.png", "elephant.png", "fox.png", "girrafe.png", "kangaroo.png", "koala.png", "lizard.png", "otter.png", "owl.png"];

    // Welcome the user
    const username = urlParams.get('username');
    $("#hello-user").text("Good Luck "+ username + "!");

    // This function flips a card
    function flipCard(card){
        // Flip the card only if the card is pressable
        // (The card is not pressable only if the card is a part of a discovered pair)
        if(!card.hasClass(not_pressable_class)){
            // If the card was not shown - upside down -> now will be shown
            if(card.hasClass(not_visible_class))
                visible_cards_count += card.length;
            // If the card was shown -> now will not be shown
            if(card.hasClass(visible_class))
                visible_cards_count -= card.length;
            // Flip the card
            card.toggleClass(visible_class);
            card.toggleClass(not_visible_class);
        }
    }

    // This fuction checks if two are identicals 
    // That means: has the same image source
    function identical(){
        var images = $("." + visible_class + ":not(." + not_pressable_class + ")");

        // Check if the source path of the images are identical
        const result = $('img', images)[0].src == $('img', images)[1].src;
        return result;
    }

    function shuffle(cards) {
        cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 6);
        card.style.order = randomPos;
        });
    }

    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
    })

    // Create the cards dynamicly
    var numberOfCards = all_pair_count;
    for(let i=0; i < numberOfCards; i++){
        var cardTemplate = $(".card").prop('outerHTML');
        cardTemplate = $(cardTemplate).removeClass('d-none');
        $('img', cardTemplate).attr('src', "images/"+images_sources[i]);
    
        $('.all-cards').append(cardTemplate);
    
        var secondCardTemplate = $(cardTemplate).clone();
        $('.all-cards').append(secondCardTemplate);

    }

    const cards = document.querySelectorAll('.card');
    shuffle(cards);

    $('.card').click(function(e){
        
        // Start the stopwatch on the FIRST card flip in the game
        card_flips ++;
        if(card_flips == 1) {
            // Start the stopwatch
            $("#stopwatch").timer({
                action: 'start', 
                seconds: 0
                });
        }

        if(visible_cards_count < allowd_visible_cards_no || $(this).hasClass(visible_class)){
            flipCard($(this));
            if (visible_cards_count == allowd_visible_cards_no){

                // methology if two cards are the same
                if(identical()){

                    // Make the matching pair of cards unpressable
                    $("." + visible_class).addClass(not_pressable_class);
                    visible_cards_count = 0;
                    shown_pair_count ++;

                    // End of the game
                    if(shown_pair_count == all_pair_count){
                        $("#stopwatch").timer('pause');
                        const finish_time = $("#stopwatch").data('seconds');
                        var finish_note = "You have completed the game in " + finish_time + ' seconds.';
                        document.getElementById('modalTimeOutput').innerHTML = finish_note;       
                        $("#myModal").show();
                    }
                }
                else{
                    setTimeout(function(){
                        const cards = $("." + visible_class + ":not(." + not_pressable_class + ")");
                        flipCard(cards);
                    }, 350);   
                }
            }
        }
    })
});