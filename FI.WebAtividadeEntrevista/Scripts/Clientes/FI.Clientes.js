
$(document).ready(function () {
    $("#btnBeneficiarios").click(function () {
        $("#beneficiariosPopUp").dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                "Fechar": function () {
                    $(this).dialog("close");
                }
            }
        });

        $("#beneficiariosPopUp").dialog("open");
    });

    $("#btnIncluirBeneficiario").click(function () {
        $.ajax({
            url: urlVerificarCPF,
            method: "POST",
            data: {
                "CPF": $("#CPFBeneficiario").val(),
            },
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {
                    var nome = $("#NomeBeneficiario").val();
                    var cpf = $("#CPFBeneficiario").val();
                    $("tbody").append("<tr><td>" + cpf + "</td><td>" + nome + "</td></tr>");
                }
        })
    });

    $('#formCadastro').submit(function (e) {
        var idCliente = "";
        var sucess = "";
        e.preventDefault();
        $.ajax({
            url: urlPost,
            method: "POST",
            async: false,
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "CPF": $(this).find("#CPF").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val()
            },
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {
                    idCliente = r;
                    $('tbody tr').each(function () {
                        cpf = $(this).find('td:eq(0)').text();
                        nome = $(this).find('td:eq(1)').text();

                        $.ajax({
                            url: urlIncluirBeneficiario,
                            method: "POST",
                            async: false,
                            data: {
                                "NOME": nome,
                                "CPF": cpf,
                                "IDCLIENTE": idCliente
                            },
                            success:
                                function (r) {
                                    sucess = "e Beneficiario";
                                }
                        });
                    });
                    ModalDialog("Sucesso!", "Cliente " + sucess + " incluido com exito!")
                    $("#formCadastro")[0].reset();        
                             
                }
        });    
    })

})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}
