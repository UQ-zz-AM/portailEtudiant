jQuery.noConflict();

jQuery(document).ready(function($){

   $('.uqam_lien-rapides').click(function(){
      if($(this).hasClass('ouvert')){
         fermerLiensRapides();
      }else{
         ouvrirLiensRapides();
      };
      return false;
   });


   function ouvrirLiensRapides(){
      $('.uqam_lien-rapides').addClass('ouvert');
      TweenLite.to($('.uqam_conteneur_lien-rapides'), 0.75, {css:{top:'120%', autoAlpha:1, display:'block'}, ease:Expo.easeOut});
      TweenLite.to($('.uqam_lien-rapides .icon-plus'), 0.5, {css:{autoAlpha:0}, ease:Expo.easeOut});
      TweenLite.to($('.uqam_lien-rapides .icon-moins'), 0.5, {css:{autoAlpha:1}, ease:Expo.easeOut});
   };

   function fermerLiensRapides(){
      $('.uqam_lien-rapides').removeClass('ouvert');
      TweenLite.to($('.uqam_conteneur_lien-rapides'), 0.75, {css:{top:'100%', autoAlpha:0, display:'none'}, ease:Expo.easeOut});
      TweenLite.to($('.uqam_lien-rapides .icon-plus'), 0.5, {css:{autoAlpha:1}, ease:Expo.easeOut});
      TweenLite.to($('.uqam_lien-rapides .icon-moins'), 0.5, {css:{autoAlpha:0}, ease:Expo.easeOut});
   };

   $(document).click(function(e){
      var target = e.target;

      if(!$(target).is('.uqam_conteneur_lien-rapides')){
        fermerLiensRapides();
      };
    });
});
