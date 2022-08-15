<section id=page-donate>
  <p>يستفيد من مشاريعنا قُرابة ٧٥٬٠٠٠ مسلم <b>يوميًّا</b>، فاحرص على الأجر وساهم في تطوير مشاريعنا وإنشاء مشاريع جديدة. </p>

  <a class="styled-btn text-center block" target=_blank href="https://www.paypal.com/donate/?hosted_button_id=KFN59QL6DJ2C8">بواسطة <icon id=paypal></a>
  <hr>
  <h2>بواسطة DonorBox 🔒</h2>
  <iframe
    title=""
    src="https://donorbox.org/embed/deendev?amount=5"
    height=685px
    width=100%
    seamless
    name=donorbox
    frameborder=0
    scrolling=no
    allowpaymentrequest/>
</section>

<svelte:head>
  <script src=https://donorbox.org/widget.js paypalExpress=false></script>
</svelte:head>

<script>
export const title = 'ساهم في مشاريع «نقاية»'
</script>

<style>
#page-donate h2 {
  text-align: center;
}
a.styled-btn {
  margin: 0.5rem auto;
  max-width: 300px;
  padding: 0.5rem;
  font-weight: bold;
}
.icon-paypal {
  display: block;
  width: 100px;
  margin: 0 auto;
}
iframe[name=donorbox] {
  max-width: 500px;
  min-width: 310px;
  max-height: none !important
}
</style>
