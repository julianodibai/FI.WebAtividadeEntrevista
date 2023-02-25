$(document).ready(function () {
    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #CPF').val(obj.CPF);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);

        $.ajax({
            url: urlBeneficiariosList,
            method: "GET",
            data: {
                "idCliente": obj.Id
            },
            success: function (data) {
                $.each(data, function (index, beneficiario) {
                    $("tbody").append("<tr><td>" + beneficiario.CPF + "</td><td>" + beneficiario.Nome + "</td><td style='display: none;' >" + beneficiario.Id + "</td><td style='display: flex;gap: 10px;justify-content: end;'><button type='submit' class='btn btn-primary btn-editar'>Alterar</button><button class='btn btn-primary btn-excluir'>Excluir</button></td></tr>");
                })
            }
        })
    }

    $("#beneficiariosPopUp").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "Fechar": function () {
                $(this).dialog("close");
            }
        }
    });

    $("#btnBeneficiarios").click(function () {
        $("#beneficiariosPopUp").dialog("open");
    });

    $("#btnIncluirBeneficiario").click(function () {

        if (ExisteCPFnaGridBeneficiario($("#CPFBeneficiario").val())) {
            ModalDialog("Ocorreu um erro", "Já existe esse cpf nessa tabela.");
        }
        else {
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
                        $("tbody").append("<tr><td>" + cpf + "</td><td>" + nome + "<td style='display: flex;gap: 10px;justify-content: end;'><button type='submit' class='btn btn-primary btn-editar'>Alterar</button><button class='btn btn-primary btn-excluir'>Excluir</button></td></tr>");
                  }
            });
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
        var linha = $(this).closest('tr');
        id = linha.find("td[style='display: none;']").text();

        if (id != 0) {
            $.ajax({
                url: urlExcluirBeneficiario,
                method: "DELETE",
                data: {
                    "Id": id
                },
                success:
                    function () {
                        linha.remove();
                    }
            });             
        }
        else {
            linha.remove();
        }

        
    });

    $('#formCadastro').submit(function (e) {
        var idCliente = "";
        e.preventDefault();
        
        $.ajax({
            url: urlPost,
            method: "POST",
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
                        id = $(this).find("td[style='display: none;']").text();

                        $.ajax({
                            url: urlAlterarBeneficiario,
                            method: "POST",
                            async: false,
                            data: {
                                "NOME": nome,
                                "CPF": cpf,
                                "ID": id,
                                "IDCLIENTE": idCliente
                            },
                            success:
                                function (r) {
                                    sucess = "e Beneficiario";
                                }
                        });
                    });
                    ModalDialog("Sucesso!", "Cliente " + sucess + " incluido com exito!")

                }
        });
    })
    
})

function ExisteCPFnaGridBeneficiario(cpf) {
    var cpfEncontrado = false;

    $("tbody tr").each(function () {
        var cpfLinha = $(this).find('td:eq(0)').text();

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
