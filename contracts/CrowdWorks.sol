// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CrowdWorks is ReentrancyGuard {
    struct Project {
        string title;
        string description;
        string imageURI;
        uint256 amountRequired;
        uint256 amountCollected;
        address payable creator;
        bool isFunded;
    }

    uint256 public numberOfProjects;

    // Mappings to store project details and contributions
    mapping(uint256 => Project) public projects;
    mapping(uint256 => mapping(address => uint256)) public contributions;

    // Events to log actions
    event ProjectCreated(uint256 projectId, string title, address creator);
    event ContributionMade(uint256 projectId, address contributor, uint256 amount);
    event FundsWithdrawn(uint256 projectId, address creator, uint256 amount);

    // Function to create a new project
    function createProject(
        string memory _title,
        string memory _description,
        string memory _imageURI,
        uint256 _amountRequired
    ) public returns (uint256) {
        require(_amountRequired > 0, "Amount required must be greater than 0");

        Project storage project = projects[numberOfProjects];
        project.title = _title;
        project.description = _description;
        project.imageURI = _imageURI;
        project.amountRequired = _amountRequired;
        project.creator = payable(msg.sender);
        project.isFunded = false;

        numberOfProjects++;
        emit ProjectCreated(numberOfProjects - 1, _title, msg.sender);
        return numberOfProjects - 1;
    }

    // Function to contribute to a project
    function contribute(uint256 _projectId) public payable {
        uint256 amount = msg.value;
        Project storage project = projects[_projectId];

        require(!project.isFunded, "Project is already funded");
        require(amount > 0, "Amount must be greater than 0");
        require(
            project.amountCollected + amount <= project.amountRequired,
            "Contribution exceeds the amount required"
        );

        project.amountCollected += amount;
        contributions[_projectId][msg.sender] += amount;

        if (project.amountCollected >= project.amountRequired) {
            project.isFunded = true;
        }

        emit ContributionMade(_projectId, msg.sender, amount);
    }

    // Function to withdraw funds from a fully funded project
    function withdrawFunds(uint256 _projectId) public nonReentrant {
        Project storage project = projects[_projectId];
        require(msg.sender == project.creator, "Only the project creator can withdraw funds");
        require(project.isFunded, "Project is not fully funded yet");

        uint256 amountToWithdraw = project.amountCollected;
        project.amountCollected = 0;

        (bool success, ) = project.creator.call{value: amountToWithdraw}("");
        require(success, "Transfer failed");

        emit FundsWithdrawn(_projectId, msg.sender, amountToWithdraw);
    }

    // Function to get the list of all projects
    function getProjects() public view returns (Project[] memory) {
        Project[] memory allProjects = new Project[](numberOfProjects);

        for (uint256 i = 0; i < numberOfProjects; i++) {
            allProjects[i] = projects[i];
        }

        return allProjects;
    }
}
