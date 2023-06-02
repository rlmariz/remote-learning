Clear-Host

Set-Variable githost -Option Constant -Value https://raw.githubusercontent.com/rlmariz/virtual-lab-deploy/main/aws
Set-Variable TerraFormZip -Option Constant -Value terraform_1.1.7_windows_amd64.zip
Set-Variable TerraFormDow -Option Constant -Value https://releases.hashicorp.com/terraform/1.1.7/terraform_1.1.7_windows_amd64.zip

if (!(Test-Path .\terraform.exe)) {
    Invoke-WebRequest -Uri $TerraFormDow -OutFile .\$TerraFormZip
    Expand-Archive .\$TerraFormZip -DestinationPath .\
    Remove-Item .\$TerraFormZip
}

function Get-DownloadGitFile {

    param (
        [string]$FileName
    )

    Invoke-WebRequest -Uri $githost/$FileName -OutFile .\$FileName
}

Get-DownloadGitFile -FileName backend.tf
Get-DownloadGitFile -FileName ec2.tf
Get-DownloadGitFile -FileName outputs.tf
Get-DownloadGitFile -FileName security.tf
if (!(Test-Path .\variables.tf)) {
    Get-DownloadGitFile -FileName variables.tf
}

function Get-Menu {

    # PromptForChoice Args
    $Title = "Instalar Virtuallab no AWS?"
    $Prompt = "Escolha uma opcao:"
    $Choices = [System.Management.Automation.Host.ChoiceDescription[]] @("&1-Instalar", "&2-Remover", "&3-Cancelar")
    $Default = 2
    
    # Prompt for the choice
    $Choice = $host.UI.PromptForChoice($Title, $Prompt, $Choices, $Default)
    
    # Action based on the choice
    switch($Choice)
    {
        0 { 
            .\terraform init
            .\terraform apply -auto-approve -input=false 
        }
        1 { 
            .\terraform destroy -auto-approve -input=false 
        }    
    }

    Write-Host "."
    Write-Host ".."
    Write-Host "..."
    Write-Host "Processo Finalizado"
    Write-Host "..."
    Write-Host ".."
    Write-Host "."
    Write-Host ""
    Write-Host ""

    if ($Choice -ne 2){
        Get-Menu
    }

    Exit

}

Get-Menu