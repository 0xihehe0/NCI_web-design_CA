/*
 * @Author: yaojinxi 864554492@qq.com
 * @Date: 2023-12-01 16:02:10
 * @LastEditors: yao 864554492@qq.com
 * @LastEditTime: 2023-12-09 12:43:00
 * @FilePath: \CA-WD\NCI_web-design_CA\js\form.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        console.log(form);
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()


  // 在页面加载时弹出弹窗
  $(document).ready(openModal);

  const overlay = $('.overlay');
  const modal = $('.modal');

  function openModal() {
    overlay.show();
    modal.show();
  }

  function closeModal(isYes) {
    $(".overlay-container").hide();
        $(".game-modal").hide();
    if (isYes) {
        // 执行跳转到别的页面的逻辑
        window.location.href = "../pages/game1.html"; // 请替换为你想要跳转的页面
        
    } else {
        // 执行关闭窗口的逻辑
    }
}