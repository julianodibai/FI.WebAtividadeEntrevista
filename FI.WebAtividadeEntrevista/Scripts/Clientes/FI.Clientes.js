$(document).ready(function () {
    $("#formCadastro #CPF").inputmask("mask", { "mask": "999.999.999-99" }, { 'autoUnmask': true, 'removeMaskOnSubmit': true });
    $("#formCadastro #CEP").inputmask("mask", { "mask": "99999-999" }, { 'autoUnmask': true, 'removeMaskOnSubmit': true });
    $("#formCadastro #Telefone").inputmask("mask", { "mask": "(99) 9999-99999" }, { 'autoUnmask': true, 'removeMaskOnSubmit': true });

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
        $("#CPFBeneficiario").inputmask("mask", { "mask": "999.999.999-99" }, { 'autoUnmask': true, 'removeMaskOnSubmit': true });
    });

    $("#btnIncluirBeneficiario").click(function () {
  
        if (ExisteCPFnaGridBeneficiario($("#CPFBeneficiario").inputmask("unmaskedvalue"))) {
            ModalDialog("Ocorreu um erro", "Já existe cpf nessa tabela.");
        }
        else {
            $.ajax({
                url: urlVerificarCPF,
                method: "POST",
                data: {
                    "CPF": $("#CPFBeneficiario").inputmask("unmaskedvalue"),
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
                        $("tbody").append("<tr><td>" + cpf + "</td><td>" + nome + "<td style='display: flex;gap: 10px;justify-content: end;'><button type='submit' class='btn btn-primary btn-editar'>Alterar</button><button class='btn btn-primary btn-excluir'>Excluir</button></td></tr>");
                    }
            })
        }     
    });

    $('tbody').on('click', '.btn-editar', function () {   
        var nome = prompt("Digite o novo nome:");
        var cpf = prompt("Digite o novo CPF:");
        var linha = $(this).closest('tr');

        if (ExisteCPFnaGridBeneficiario(cpf)) {
            ModalDialog("Ocorreu um erro", "Já existe esse cpf nessa tabela.");
        }
        else {
            $.ajax({
                url: urlVerificarCPF,
                method: "POST",
                data: {
                    "CPF": cpf
                },
                error:
                    function (r) {
                        if (r.status == 400)
                            ModalDialog("Ocorreu um erro", r.responseJSON);
                        else if (r.status == 500)
                            ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                    },
                success:
                    function () {
                        linha.find('td:eq(0)').text(cpf);
                        linha.find('td:eq(1)').text(nome);
                    }
            });
        }
    });

    $('tbody').on('click', '.btn-excluir', function () {
        $(this).closest('tr').remove();
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
                "CEP": $(this).find("#CEP").inputmask("unmaskedvalue"),
                "CPF": $(this).find("#CPF").inputmask("unmaskedvalue"),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").inputmask("unmaskedvalue")
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
                        cpf = cpf.replace(/\D/g, '');

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
    });

})

function ExisteCPFnaGridBeneficiario(cpf) {
    var cpfEncontrado = false;

    $("tbody tr").each(function () {
        var cpfLinha = $(this).find('td:eq(0)').text();

        cpfLinha = cpfLinha.replace(/\D/g, '');

        if (cpfLinha == cpf) {
            cpfEncontrado = true;
            return false; 
        }
    });

    return cpfEncontrado;
}

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
